import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  Post,
  Delete,
  UploadedFile,
  Param,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UserUpdateDtoSchema,
  UserUpdateDto,
  PaginationParamsDtoSchema,
  PaginationParamsDto,
} from '@unidatex/dto';

import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { UserEntity } from '#shared/entities';
import { ZodValidationPipe } from '#shared/pipes/zod-validation.pipe';
import { UUIDZodValidationPipe } from '#shared/pipes/uuid-validation.pipe';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { UserPhotoFileValidation } from '../pipes/user-photo-file-validation.pipe';
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

  @Get('/views')
  @UseGuards(AuthGuard)
  public async getMyProfileIncomingViews(
    @CurrentUser() currentUser: UserEntity,
    @Query(new ZodValidationPipe(PaginationParamsDtoSchema))
    paginationParams: PaginationParamsDto,
  ) {
    return this.usersService.getUserProfileIncomingViews(
      currentUser.id,
      paginationParams,
    );
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  public getUser(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', UUIDZodValidationPipe) userId: string,
  ) {
    return this.usersService.getUser(currentUser, userId);
  }

  @Post('/photos')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public addPhoto(
    @CurrentUser() currentUser: UserEntity,
    @UploadedFile(UserPhotoFileValidation) file: Express.Multer.File,
  ) {
    return this.usersService.addPhoto(currentUser, file);
  }

  @Delete('/photos/:id')
  @UseGuards(AuthGuard)
  public removePhoto(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', UUIDZodValidationPipe) photoId: string,
  ) {
    return this.usersService.removePhoto(currentUser, photoId);
  }

  @Patch('/photos/:id/primary')
  @UseGuards(AuthGuard)
  public makePrimaryPhoto(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', UUIDZodValidationPipe) photoId: string,
  ) {
    return this.usersService.makePhotoPrimary(currentUser, photoId);
  }
}
