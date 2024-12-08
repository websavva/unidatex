import { Controller, Get, UseGuards, Param } from '@nestjs/common';

import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { UserEntity } from '#shared/entities';
import { UUIDZodValidationPipe } from '#shared/pipes/uuid-validation.pipe';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { UsersService } from '../services/users.service';

@Controller()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/:id')
  public async getUser(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', UUIDZodValidationPipe) userId: string,
  ) {
    const user = await this.usersService.getUser(userId);

    const isSelf = currentUser.id === userId;

    if (!isSelf) {
      await this.usersService.createUserProfileView(currentUser, user);
    }

    return user;
  }
}
