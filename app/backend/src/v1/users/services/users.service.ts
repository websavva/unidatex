import { Injectable, Inject } from '@nestjs/common';
import { Express } from 'express';

import { UserUpdateDto } from '@unidatex/dto';

import { FileStorageService } from '#shared/modules/file-storage/file-storage.service';
import {
  UsersRepository,
  USERS_REPOSITORY_INJECTION_KEY,
} from '#shared/repositories/users.repository';
import { UserEntity } from '#shared/entities';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_INJECTION_KEY)
    private usersRepository: UsersRepository,
    private fileStorageService: FileStorageService,
  ) {}

  public async updateUser(userId: string, userUpdateDto: UserUpdateDto) {
    await this.usersRepository.update(userId, userUpdateDto);

    return this.usersRepository.findOneByOrFail({
      id: userId,
    });
  }

  public async addPhoto(user: UserEntity,  file: Express.Multer.File) {
  }
}
