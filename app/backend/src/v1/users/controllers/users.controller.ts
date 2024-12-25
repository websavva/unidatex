import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common';
import {
  PaginationParamsDto,
  PaginationParamsDtoSchema,
  UsersSearchParamsDto,
  UsersSearchParamsDtoSchema,
} from '@unidatex/dto';

import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { UserEntity } from '#shared/entities';
import { UUIDZodValidationPipe } from '#shared/pipes/uuid-validation.pipe';

import { ProfileService } from '../../profile/services/profile.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { UsersService } from '../services/users.service';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';

@Controller()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profileService: ProfileService,
  ) {}

  @Get('/')
  public getUsers(
    @Query(new ZodValidationPipe(UsersSearchParamsDtoSchema))
    usersSearchParamsDto: UsersSearchParamsDto,
  ) {
    return this.usersService.getUsers(usersSearchParamsDto);
  }

  @Get('/new')
  public getNewUsers(
    @Query(new ZodValidationPipe(PaginationParamsDtoSchema))
    paginationParams: PaginationParamsDto,
  ) {
    return this.usersService.getNewUsers(paginationParams);
  }

  @Get('/birthday')
  public getBirthdayUsers(
    @Query(new ZodValidationPipe(PaginationParamsDtoSchema))
    paginationParams: PaginationParamsDto,
  ) {
    return this.usersService.getBirthdayUsers(paginationParams);
  }

  @Get('/:id')
  public async getUser(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', UUIDZodValidationPipe) userId: string,
  ) {
    const user = await this.usersService.getUser(userId);

    const isSelf = currentUser.id === userId;

    if (!isSelf) {
      await this.profileService.createProfileView(currentUser, user);
    }

    return user;
  }
}
