import { Repository, EntityRepository } from 'typeorm';

import { UserEntity } from '#shared/entities';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  findUserByEmail(email: string, strict?: false): Promise<UserEntity | null>;
  findUserByEmail(email: string, strict?: true): Promise<UserEntity>;
  async findUserByEmail(email: string, strict: boolean = false) {
    const where = {
      email,
    };

    if (strict) {
      return this.findOneByOrFail(where);
    } else {
      return this.findOneBy(where);
    }
  }
}
