import { FactoryProvider } from '@nestjs/common';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';

export function defineExtendedRepositoryProvider<
  Entity extends ObjectLiteral,
  CustomRepository extends Record<
    string,
    (this: Repository<Entity>, ...args: any[]) => any
  >,
  ExtendedRepository = CustomRepository & Repository<Entity>,
>(
  injectionKey: string,
  entity: new () => Entity,
  customRepository: CustomRepository,
): FactoryProvider<ExtendedRepository> {
  return {
    provide: injectionKey,
    useFactory: (dataSource: DataSource) => {
      return dataSource
        .getRepository(entity)
        .extend(customRepository) as unknown as ExtendedRepository;
    },

    inject: [DataSource],
  };
}

export type InferExtendedRepository<
  T extends FactoryProvider<any>,
  ExtendedRepository = T extends FactoryProvider<infer R> ? R : never,
> = ExtendedRepository;
