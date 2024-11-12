import {
  Controller,
  Post,
  UsePipes,
  Body,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import {
  AuthSignUpDtoSchema,
  AuthSignUpDto,
  AuthSignUpConfirmDto,
  AuthSignUpConfirmDtoSchema,
  AuthLoginDtoSchema,
  AuthLoginDto,
  AuthPasswordResetDtoSchema,
  AuthPasswordResetDto,
  AuthPasswordResetConfirmDtoSchema,
  AuthPasswordResetConfirmDto,
} from '@unidatex/dto';

import { ZodValidationPipe } from '#shared/pipes/zod-validation.pipe';
import { JwtExceptionFilter } from '#shared/exception-filters/jwt.exception-filter';

import { AuthService } from '../service/auth.service';
import { GuestGuard } from '../guards/guest.guard';

@Controller()
@UseFilters(JwtExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(GuestGuard)
  @UsePipes(new ZodValidationPipe(AuthSignUpDtoSchema))
  @Post('/sign-up')
  public signUp(@Body() signUpDto: AuthSignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(GuestGuard)
  @Post('/sign-up/confirm')
  public confirmSignUp(
    @Query(new ZodValidationPipe(AuthSignUpConfirmDtoSchema))
    { token }: AuthSignUpConfirmDto,
  ) {
    return this.authService.confirmSignUp(token);
  }

  @UseGuards(GuestGuard)
  @UsePipes(new ZodValidationPipe(AuthLoginDtoSchema))
  @Post('/login')
  public logIn(@Body() loginDto: AuthLoginDto) {
    return this.authService.logIn(loginDto);
  }

  @UseGuards(GuestGuard)
  @UsePipes(new ZodValidationPipe(AuthPasswordResetDtoSchema))
  @Post('/password-reset')
  public requestPasswordReset(@Body() passwordResetDto: AuthPasswordResetDto) {
    return this.authService.requestPasswordReset(passwordResetDto);
  }

  @UseGuards(GuestGuard)
  @UsePipes(new ZodValidationPipe(AuthPasswordResetConfirmDtoSchema))
  @Post('/password-reset/confirm')
  public confirmPasswordReset(
    @Body()
    passwordResetConfirmDto: AuthPasswordResetConfirmDto,
  ) {
    return this.authService.confirmPasswordReset(passwordResetConfirmDto);
  }
}
