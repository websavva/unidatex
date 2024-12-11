import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import {
  UsersRepository,
  USERS_REPOSITORY_INJECTION_KEY,
} from '#shared/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_INJECTION_KEY)
    private usersRepository: UsersRepository,
  ) {}

  public throwUserNotFoundException(userId): never {
    throw new NotFoundException(`User with id "${userId}" is not found`);
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

    if (!user) this.throwUserNotFoundException(userId);

    return user;
  }
}
