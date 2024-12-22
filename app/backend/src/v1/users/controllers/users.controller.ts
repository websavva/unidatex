import { Controller, Get, UseGuards, Param } from '@nestjs/common';

import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { UserEntity } from '#shared/entities';
import { UUIDZodValidationPipe } from '#shared/pipes/uuid-validation.pipe';

import { ProfileService } from '../../profile/services/profile.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { UsersService } from '../services/users.service';

@Controller()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profileService: ProfileService,
  ) {}

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
