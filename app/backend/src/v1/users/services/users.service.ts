import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserUpdateDto } from '@unidatex/dto';

import {
  UsersRepository,
  USERS_REPOSITORY_INJECTION_KEY,
} from '#shared/repositories/users.repository';
import { UserEntity, UserProfileView } from '#shared/entities';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_INJECTION_KEY)
    private usersRepository: UsersRepository,
    @InjectRepository(UserProfileView)
    private userProfileViewsRepository: Repository<UserProfileView>,
  ) {}

  protected throwPhotoNotFoundException(photoId): never {
    throw new NotFoundException(`Photo with id "${photoId}" is not found`);
  }

  protected throwUserNotFoundException(userId): never {
    throw new NotFoundException(`User with id "${userId}" is not found`);
  }

  public async updateUser(userId: string, userUpdateDto: UserUpdateDto) {
    await this.usersRepository.update(userId, userUpdateDto);

    return this.usersRepository.findOneByOrFail({
      id: userId,
    });
  }

  public async getUser(userId: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },

      relations: {
        photos: true,
      },
    });

    if (!user) this.throwPhotoNotFoundException(userId);

    return user;
  }

  public createUserProfileView(viewer: UserEntity, viewedUser: UserEntity) {
    return this.userProfileViewsRepository.insert([
      {
        viewedUser,
        viewer,
      },
    ]);
  }
}
