import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '#shared/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
  ) {}

  findUserByEmail(email: string, strict?: false): Promise<User | null>;
  findUserByEmail(email: string, strict?: true): Promise<User>;
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
