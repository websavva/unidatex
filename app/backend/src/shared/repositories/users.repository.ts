import { UserEntity } from '#shared/entities';

import {
  defineExtendedRepositoryProvider,
  InferExtendedRepository,
} from './utils/define-extended-repository-provider';

export const UsersRepositoryProvider = defineExtendedRepositoryProvider(
  'UsersRepository',
  UserEntity,
  {
    async findUserByEmail(
      email: string,
      strict: boolean = false,
    ): Promise<UserEntity | null> {
      const where = {
        email,
      };

      if (strict) {
        return this.findOneByOrFail(where);
      } else {
        return this.findOneBy(where);
      }
    },
  },
);

export const USERS_REPOSITORY_INJECTION_KEY = UsersRepositoryProvider.provide;

export type UsersRepository = InferExtendedRepository<
  typeof UsersRepositoryProvider
>;
