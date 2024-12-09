import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserPhotoCountMaxRange } from '@unidatex/constants';
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
} from '#shared/entities';
import { PaginationService } from '#shared/services/pagination.service';

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
    @Inject(DataSource) private dataSource: DataSource,
    private paginationService: PaginationService,
  ) {}

  protected throwPhotoNotFoundException(photoId): never {
    throw new NotFoundException(`Photo with id "${photoId}" is not found`);
  }

  public async updateProfile(userId: string, userUpdateDto: UserUpdateDto) {
    await this.usersRepository.update(userId, userUpdateDto);

    return this.usersRepository.findOneByOrFail({
      id: userId,
    });
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

  public async addPhoto(currentUser: UserEntity, file: Express.Multer.File) {
    if (currentUser.photos.length >= UserPhotoCountMaxRange.max)
      throw new BadRequestException(
        `Only ${UserPhotoCountMaxRange.max} photos can be uploaded`,
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
