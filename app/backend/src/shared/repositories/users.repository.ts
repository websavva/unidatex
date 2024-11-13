import { UserEntity } from '#shared/entities';

import {
  defineExtendedRepositoryProvider,
  InferExtendedRepository,
} from './utils/define-extended-repository-provider';

export const UsersRepositoryProvider = defineExtendedRepositoryProvider(
  'UsersRepository',
  UserEntity,
  {
    async findUserByEmail<
      Strict extends boolean = false,
      R = Strict extends false ? UserEntity | null : UserEntity,
    >(email: string, strict?: Strict): Promise<R> {
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
