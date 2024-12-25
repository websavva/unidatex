import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import {
  UsersRepository,
  USERS_REPOSITORY_INJECTION_KEY,
} from '#shared/repositories/users.repository';
import { PaginationParamsDto, UsersSearchParamsDto } from '@unidatex/dto';

import { PaginationService } from '#shared/services/pagination.service';
import { SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '@/shared/entities';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_INJECTION_KEY)
    private usersRepository: UsersRepository,
    private paginationService: PaginationService,
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

  public getNewUsers(paginationParams: PaginationParamsDto) {
    const todayDate = new Date();

    todayDate.setHours(0, 0, 0, 0);

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1e3;

    const currentWeekStartDate = new Date(+todayDate - sevenDaysInMs);

    const newUsersQueryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where('user.signedUpAt >= :date', {
        date: currentWeekStartDate.toISOString(),
      })
      .orderBy('user.signedUpAt', 'DESC');

    return this.paginationService.paginate(
      newUsersQueryBuilder,
      paginationParams,
      'users',
    );
  }

  public getBirthdayUsers(paginationParams: PaginationParamsDto) {
    const todayDate = new Date();

    todayDate.setHours(0, 0, 0, 0);

    const currentMonth = todayDate.getMonth() + 1;
    const currentMonthDay = todayDate.getDate();

    const birthdayUsersQueryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where('EXTRACT(MONTH FROM user.birthDate) = :currentMonth', {
        currentMonth,
      })
      .andWhere('EXTRACT(DAY FROM user.birthDate) = :currentMonthDay', {
        currentMonthDay,
      })
      .orderBy('user.name', 'ASC');

    return this.paginationService.paginate(
      birthdayUsersQueryBuilder,
      paginationParams,
      'users',
    );
  }

  private searchUsersQueryBuilderModifiers: Array<{
    fieldNames: Array<
      keyof Omit<UsersSearchParamsDto, keyof PaginationParamsDto>
    >;
    apply: (
      queryBuilder: SelectQueryBuilder<UserEntity>,
      searchFieldName: string,
      searchFieldValue: any,
    ) => SelectQueryBuilder<UserEntity>;
  }> = [
    {
      fieldNames: ['gender', 'country', 'targetedGender', 'hasChildren'],
      apply: (qb, name, value) => {
        const searchFieldName = `${name}Value`;

        return qb.andWhere(`user.${name} = :${searchFieldName}`, {
          [searchFieldName]: value,
        });
      },
    },
    {
      fieldNames: ['name'],
      apply: (qb, _, value) => {
        return qb.andWhere('LOWER(user.name) LIKE :nameToSearch', {
          nameToSearch: `%${value.toLowerCase()}%`,
        });
      },
    },
    {
      fieldNames: [
        'ethnicity',
        'educationLevel',
        'living',
        'maritalStatus',
        'wouldRelocate',
        'wouldTravel',
        'bodyType',
        'smokingHabits',
        'drinkingHabits',
        'eatingHabits',
        'occupation',
        'physicalLook',
        'religion',
      ],
      apply: (qb, name, values) => {
        const searchFieldValueName = `${name}Values`;

        return qb.andWhere(`user.${name} IN (:...${searchFieldValueName})`, {
          [searchFieldValueName]: values,
        });
      },
    },
    {
      fieldNames: [
        'minAge',
        'maxAge',
        'minHeight',
        'maxHeight',
        'minHeight',
        'maxWeight',
      ],

      apply: (qb, name, value) => {
        const { groups: { limitType, fieldName } = {} } = name.match(
          /(?<limitType>min|max)(?<fieldName>\w+)/,
        )!;

        const searchFieldName = `${name}Value`;
        const comparisonSign = limitType === 'max' ? '<=' : '>=';

        const normalizedFieldName =
          fieldName[0].toLowerCase() + fieldName.slice(1);

        if (normalizedFieldName === 'age') {
          return qb.where(
            `DATE_PART('year', AGE(user.birthDate)) ${comparisonSign} :${searchFieldName}`,
            {
              [searchFieldName]: value,
            },
          );
        } else {
          return qb.andWhere(
            `user.${normalizedFieldName} ${comparisonSign} :${searchFieldName}`,
            {
              [searchFieldName]: value,
            },
          );
        }
      },
    },
    {
      fieldNames: ['languages'],
      apply: (qb, _, values) => {
        return qb.andWhere('user.languages && :languageValues', {
          languageValues: values,
        });
      },
    },
    {
      fieldNames: ['city'],
      apply: (qb, _, value) => {
        return qb
          .leftJoinAndSelect('user.city', 'city')
          .where('city.id = :citiId', {
            cityId: value,
          });
      },
    },
  ];

  public getUsers({ page, perPage, ...searchParams }: UsersSearchParamsDto) {
    const paginationParams = {
      page,
      perPage,
    };

    let searchUsersQueryBuilder =
      this.usersRepository.createQueryBuilder('user');

    for (const [searchFieldName, searchFieldValue] of Object.entries(
      searchParams,
    )) {
      const qbModifier = this.searchUsersQueryBuilderModifiers.find(
        ({ fieldNames }) => fieldNames.includes(searchFieldName as any),
      );

      if (!qbModifier) continue;

      searchUsersQueryBuilder = qbModifier.apply(
        searchUsersQueryBuilder,
        searchFieldName,
        searchFieldValue,
      );
    }

    return this.paginationService
      .paginate(searchUsersQueryBuilder, paginationParams, 'users')
      .then(({ users }) => {
        debugger;
        return users;
      });
  }
}
