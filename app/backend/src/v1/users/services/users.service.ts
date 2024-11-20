import { Injectable, Inject } from '@nestjs/common';

import { UserUpdateDto } from '@unidatex/dto';

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

  public async updateUser(userId: string, userUpdateDto: UserUpdateDto) {
    await this.usersRepository.update(userId, userUpdateDto);

    return this.usersRepository.findOneByOrFail({
      id: userId,
    });
  }
}
