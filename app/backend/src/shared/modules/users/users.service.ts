import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '#shared/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) public usersRepository: Repository<UserEntity>,
  ) {}

  findUserByEmail(email: string, strict?: false): Promise<UserEntity | null>;
  findUserByEmail(email: string, strict?: true): Promise<UserEntity>;
  async findUserByEmail(email: string, strict: boolean = false) {
    const where = {
      email,
    };

    if (strict) {
      return this.usersRepository.findOneByOrFail(where);
    } else {
      return this.usersRepository.findOneBy(where);
    }
  }
}
