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
import { UserFavoriteType } from '@unidatex/constants';

import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { UserEntity } from '#shared/entities';
import { ZodValidationPipe } from '#shared/pipes/zod-validation.pipe';
import { UUIDZodValidationPipe } from '#shared/pipes/uuid-validation.pipe';
import { EnumZodValidationPipe } from '@/shared/pipes/enum-validation.pipe';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { ProfilePhotoFileValidation } from '../pipes/photo-file-validation.pipe';
import { ProfileService } from '../services/profile.service';

@Controller()
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/')
  public getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Patch('/')
  public updateProfile(
    @CurrentUser() currentUser: UserEntity,
    @Body(new ZodValidationPipe(UserUpdateDtoSchema))
    userUpdateDto: UserUpdateDto,
  ) {
    return this.profileService.updateProfile(currentUser.id, userUpdateDto);
  }

  @Get('/views')
  public async getProfileIncomingViews(
    @CurrentUser() currentUser: UserEntity,
    @Query(new ZodValidationPipe(PaginationParamsDtoSchema))
    paginationParams: PaginationParamsDto,
  ) {
    return this.profileService.getProfileIncomingViews(
      currentUser.id,
      paginationParams,
    );
  }

  @Get('/favorites/:type')
  public async getProfileFavorites(
    @CurrentUser() currentUser: UserEntity,
    @Param('type', new EnumZodValidationPipe(UserFavoriteType))
    type: UserFavoriteType,
    @Query(new ZodValidationPipe(PaginationParamsDtoSchema))
    paginationParams: PaginationParamsDto,
  ) {
    return this.profileService.getProfileFavorites(
      currentUser,
      type,
      paginationParams,
    );
  }

  @Post('/favorites/:userId')
  public async addUserToFavorites(
    @CurrentUser() currentUser: UserEntity,
    @Param('userId', new UUIDZodValidationPipe('userId')) userId: string,
  ) {
    return this.addUserToFavorites(currentUser, userId);
  }

  @Delete('/favorites/:userId')
  public async removeUserFromFavorites(
    @CurrentUser() currentUser: UserEntity,
    @Param('userId', new UUIDZodValidationPipe('userId')) userId: string,
  ) {
    return this.removeUserFromFavorites(currentUser, userId);
  }

  @Post('/photos')
  @UseInterceptors(FileInterceptor('file'))
  public addProfilePhoto(
    @CurrentUser() currentUser: UserEntity,
    @UploadedFile(ProfilePhotoFileValidation) file: Express.Multer.File,
  ) {
    return this.profileService.addPhoto(currentUser, file);
  }

  @Delete('/photos/:id')
  public removeProfilePhoto(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', UUIDZodValidationPipe) photoId: string,
  ) {
    return this.profileService.removePhoto(currentUser, photoId);
  }

  @Patch('/photos/:id/primary')
  public makePrimaryProfilePhoto(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', UUIDZodValidationPipe) photoId: string,
  ) {
    return this.profileService.makePhotoPrimary(currentUser, photoId);
  }
}
