import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserPhotoCountMaxRange } from '@unidatex/constants';
import { UserUpdateDto } from '@unidatex/dto';

import { FileStorageService } from '#shared/modules/file-storage/file-storage.service';
import {
  UsersRepository,
  USERS_REPOSITORY_INJECTION_KEY,
} from '#shared/repositories/users.repository';
import { UserEntity, UserPhotoEntity } from '#shared/entities';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_INJECTION_KEY)
    private usersRepository: UsersRepository,
    private fileStorageService: FileStorageService,
    @InjectRepository(UserPhotoEntity)
    private userPhotosRepository: Repository<UserPhotoEntity>,
  ) {}

  public async updateUser(userId: string, userUpdateDto: UserUpdateDto) {
    await this.usersRepository.update(userId, userUpdateDto);

    return this.usersRepository.findOneByOrFail({
      id: userId,
    });
  }

  public async addPhoto(user: UserEntity, file: Express.Multer.File) {
    if (user.photos.length >= UserPhotoCountMaxRange.max)
      throw new BadRequestException(
        `Only ${UserPhotoCountMaxRange.max} photos can be uploaded`,
      );

    const generatedPhotoFileName =
      this.fileStorageService.generateUniqueFilename(file.mimetype);

    const photoRelativePath = `/photos/${generatedPhotoFileName}`;

    await this.fileStorageService.uploadFile(photoRelativePath, file.buffer);

    const isFirstPhoto = !user.photos.length;

    const newPhoto = this.userPhotosRepository.create({
      user,
      key: photoRelativePath,
      isPrimary: isFirstPhoto,
    });

    return this.userPhotosRepository.save(newPhoto);
  }
}
