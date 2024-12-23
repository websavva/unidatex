import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import {
  UsersRepository,
  USERS_REPOSITORY_INJECTION_KEY,
} from '#shared/repositories/users.repository';
import { PaginationParamsDto } from '@unidatex/dto';

import { PaginationService } from '#shared/services/pagination.service';

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
    );
  }

  public getBirthdayUsers(paginationParams: PaginationParamsDto) {
    const todayDate = new Date();

    todayDate.setHours(0, 0, 0, 0);

    const currentMonth = todayDate.getMonth() + 1;
    const currentMonthDay = todayDate.getDate();

    const newUsersQueryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where('EXTRACT(MONTH FROM user.birthDate) = :currentMonth', {
        currentMonth,
      })
      .andWhere('EXTRACT(DAY FROM user.birthDate) = :currentMonthDay', {
        currentMonthDay,
      })
      .orderBy('user.name', 'ASC');

    return this.paginationService.paginate(
      newUsersQueryBuilder,
      paginationParams,
    );
  }
}
