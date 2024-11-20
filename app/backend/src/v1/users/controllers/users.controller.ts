import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { UserUpdateDtoSchema, UserUpdateDto } from '@unidatex/dto';

import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { UserEntity } from '#shared/entities';
import { ZodValidationPipe } from '#shared/pipes/zod-validation.pipe';

import { AuthGuard } from '../../auth/guards/auth.guard';

import { UsersService } from '../services/users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  public getMe(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Patch('/me')
  @UseGuards(AuthGuard)
  public updateUser(
    @CurrentUser() currentUser: UserEntity,
    @Body(new ZodValidationPipe(UserUpdateDtoSchema))
    userUpdateDto: UserUpdateDto,
  ) {
    return this.usersService.updateUser(currentUser.id, userUpdateDto);
  }
}
