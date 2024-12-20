import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserPhotoCountMaxRange, UserFavoriteType } from '@unidatex/constants';
import { UserUpdateDto, PaginationParamsDto } from '@unidatex/dto';

import { FileStorageService } from '#shared/modules/file-storage/file-storage.service';
import {
  UsersRepository,
  USERS_REPOSITORY_INJECTION_KEY,
} from '#shared/repositories/users.repository';
import {
  UserEntity,
  UserPhotoEntity,
  UserProfileViewEntity,
  UserFavoriteEntity,
} from '#shared/entities';
import { PaginationService } from '#shared/services/pagination.service';
import { CityEntity } from '#shared/entities/city.entity';

import { GeoService } from '../../geo/services/geo.service';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(USERS_REPOSITORY_INJECTION_KEY)
    private usersRepository: UsersRepository,
    private fileStorageService: FileStorageService,
    @InjectRepository(UserPhotoEntity)
    private userPhotosRepository: Repository<UserPhotoEntity>,
    @InjectRepository(UserProfileViewEntity)
    private userProfileViewsRepository: Repository<UserProfileViewEntity>,
    @InjectRepository(UserFavoriteEntity)
    private userFavoritesRepository: Repository<UserFavoriteEntity>,
    @Inject(DataSource) private dataSource: DataSource,
    private paginationService: PaginationService,
    private usersService: UsersService,
    private geoService: GeoService,
  ) {}

  protected throwPhotoNotFoundException(photoId): never {
    throw new NotFoundException(`Photo with id "${photoId}" is not found`);
  }

  public async updateProfile(userId: string, userUpdateDto: UserUpdateDto) {
    const userToUpdate = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!userToUpdate) this.usersService.throwUserNotFoundException(userId);

    const { city: cityId, ...userBaseFields } = userUpdateDto;

    let newCity: null | undefined | CityEntity;

    if (cityId === null) {
      newCity = cityId;
    } else if (cityId) {
      newCity = await this.geoService.citiesRepository.findOneByOrFail({
        id: cityId,
      });
    }

    Object.assign(userToUpdate, { ...userBaseFields, city: newCity });

    if (userToUpdate.city && userToUpdate.city.country !== userToUpdate.country)
      throw new BadRequestException("City's country must match user's country");

    return this.usersRepository.save(userToUpdate);
  }

  public async createProfileView(viewer: UserEntity, viewedUser: UserEntity) {
    return this.userProfileViewsRepository.insert({
      viewer,
      viewedUser,
    });
  }

  public async getProfileIncomingViews(
    userId: string,
    paginationParams: PaginationParamsDto,
  ) {
    const incomingViewsQueryBuilder = this.userProfileViewsRepository
      .createQueryBuilder('profileView')
      .leftJoin('profileView.viewedUser', 'viewedUser')
      .leftJoinAndSelect('profileView.viewer', 'viewer')
      .where('viewedUser.id = :viewedUserId', {
        viewedUserId: userId,
      })
      .orderBy('profileView.viewedAt', 'DESC')
      .select(['profileView.id', 'viewer', 'profileView.viewedAt']);

    const { items: views, pagination } = await this.paginationService.paginate(
      incomingViewsQueryBuilder,
      paginationParams,
    );

    return {
      views,
      pagination,
    };
  }

  public async getProfileFavorites(
    currentUser: UserEntity,
    type: UserFavoriteType,
    paginationParams: PaginationParamsDto,
  ) {
    let profileFavoritesQueryBuilder = this.userFavoritesRepository
      .createQueryBuilder('userFavorite')
      .leftJoinAndSelect('userFavorite.user', 'user')
      .leftJoinAndSelect('userFavorite.favoritedUser', 'favoritedUser');

    if (type === UserFavoriteType.INCOMING) {
      profileFavoritesQueryBuilder = profileFavoritesQueryBuilder.where(
        'favoritedUser.id = :favoritedUserId',
        {
          favoritedUserId: currentUser.id,
        },
      );
    } else if (type === UserFavoriteType.OUTCOMING) {
      profileFavoritesQueryBuilder = profileFavoritesQueryBuilder.where(
        'user.id = :userId',
        {
          userId: currentUser.id,
        },
      );
    } else {
      profileFavoritesQueryBuilder = profileFavoritesQueryBuilder
        .where('user.id = :userId', {
          userId: currentUser.id,
        })
        .andWhere(
          (qb) =>
            'favoritedUser.id IN ' +
            qb
              .subQuery()
              .from(UserFavoriteEntity, 'userFavorite')
              .leftJoinAndSelect('userFavorite.user', 'user')
              .leftJoinAndSelect('userFavorite.favoritedUser', 'favoritedUser')
              .where('favoritedUser.id = :favoritedUserId', {
                favoritedUserId: currentUser.id,
              })
              .select('user.id')
              .getQuery(),
        );
    }

    profileFavoritesQueryBuilder = profileFavoritesQueryBuilder.orderBy(
      'userFavorite.createdAt',
      'DESC',
    );

    const { items: favorites, pagination } =
      await this.paginationService.paginate(
        profileFavoritesQueryBuilder,
        paginationParams,
      );

    return {
      favorites,
      pagination,
    };
  }

  public async addPhoto(currentUser: UserEntity, file: Express.Multer.File) {
    if (currentUser.photos.length >= UserPhotoCountMaxRange.max)
      throw new BadRequestException(
        `Only ${UserPhotoCountMaxRange.max} photos can be uploaded at max`,
      );

    const generatedPhotoFileName =
      this.fileStorageService.generateUniqueFilename(file.mimetype);

    const photoRelativePath = `/photos/${generatedPhotoFileName}`;

    await this.fileStorageService.uploadFile(photoRelativePath, file.buffer);

    const isFirstPhoto = !currentUser.photos.length;

    const newPhoto = this.userPhotosRepository.create({
      user: currentUser,
      key: photoRelativePath,
      isPrimary: isFirstPhoto,
    });

    return this.userPhotosRepository.save(newPhoto);
  }

  public async addUserToFavorites(
    currentUser: UserEntity,
    favoritedUserId: string,
  ) {
    const doesUserFavoriteExist = await this.userFavoritesRepository.exists({
      where: {
        user: {
          id: currentUser.id,
        },

        favoritedUser: {
          id: favoritedUserId,
        },
      },
    });

    if (doesUserFavoriteExist)
      throw new BadRequestException(
        `User with id "${favoritedUserId}" has been favorited already`,
      );

    const userFavorite = this.userFavoritesRepository.create({
      user: {
        id: currentUser.id,
      },

      favoritedUser: {
        id: favoritedUserId,
      },
    });

    return this.userFavoritesRepository.save(userFavorite).then(({ id }) => {
      return this.userFavoritesRepository.findOne({
        where: {
          id,
        },
      });
    });
  }

  public async removeUserFromFavorites(
    currentUser: UserEntity,
    favoritedUserId: string,
  ) {
    return this.userFavoritesRepository
      .delete({
        user: {
          id: currentUser.id,
        },

        favoritedUser: {
          id: favoritedUserId,
        },
      })
      .then(() => true);
  }

  public async removePhoto(currentUser: UserEntity, photoId: string) {
    const userPhotoToDelete = await this.userPhotosRepository.findOneBy({
      id: photoId,
      user: {
        id: currentUser.id,
      },
    });

    if (!userPhotoToDelete) this.throwPhotoNotFoundException(photoId);

    await this.dataSource.manager.transaction(
      async (transactionlaEntityManager) => {
        const shouldUpdatePrimaryUserPhoto =
          currentUser.photos.length > 1 && userPhotoToDelete.isPrimary;

        await transactionlaEntityManager.delete(UserPhotoEntity, {
          id: userPhotoToDelete.id,
        });

        if (shouldUpdatePrimaryUserPhoto) {
          const newPrimaryUserPhoto =
            await transactionlaEntityManager.findOneBy(UserPhotoEntity, {
              isPrimary: false,
            });

          if (!newPrimaryUserPhoto)
            throw new BadRequestException(
              `The given primary photo "${userPhotoToDelete.id}" cannot be delete as there is no other photo to become primary`,
            );

          await transactionlaEntityManager.update(
            UserPhotoEntity,
            {
              id: newPrimaryUserPhoto?.id,
            },
            {
              isPrimary: true,
            },
          );
        }
      },
    );

    await this.fileStorageService
      .deleteFile(userPhotoToDelete.key)
      .catch((error) => {
        console.log('UserPhoto file deletion failed');
        console.error(error);
      });

    return true;
  }

  public async makePhotoPrimary(currentUser: UserEntity, photoId: string) {
    const newPrimaryUserPhoto = await this.userPhotosRepository.findOneBy({
      id: photoId,
      user: { id: currentUser.id },
    });

    if (!newPrimaryUserPhoto) this.throwPhotoNotFoundException(photoId);

    if (newPrimaryUserPhoto.isPrimary) return true;

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update(
        UserPhotoEntity,
        {
          isPrimary: true,
        },
        {
          isPrimary: false,
        },
      );

      await transactionalEntityManager.update(
        UserPhotoEntity,
        {
          id: newPrimaryUserPhoto.id,
        },
        {
          isPrimary: true,
        },
      );
    });

    return true;
  }
}
