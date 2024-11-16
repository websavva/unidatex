import { Controller, Post, Body, UseFilters, UseGuards } from '@nestjs/common';

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
  @Post('/sign-up')
  public signUp(
    @Body(new ZodValidationPipe(AuthSignUpDtoSchema)) signUpDto: AuthSignUpDto,
  ) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(GuestGuard)
  @Post('/sign-up/confirm')
  public confirmSignUp(
    @Body(new ZodValidationPipe(AuthSignUpConfirmDtoSchema))
    { token }: AuthSignUpConfirmDto,
  ) {
    return this.authService.confirmSignUp(token);
  }

  @UseGuards(GuestGuard)
  @Post('/login')
  public logIn(
    @Body(new ZodValidationPipe(AuthLoginDtoSchema)) loginDto: AuthLoginDto,
  ) {
    return this.authService.logIn(loginDto);
  }

  @UseGuards(GuestGuard)
  @Post('/password-reset')
  public requestPasswordReset(
    @Body(new ZodValidationPipe(AuthPasswordResetDtoSchema))
    passwordResetDto: AuthPasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(passwordResetDto);
  }

  @UseGuards(GuestGuard)
  @Post('/password-reset/confirm')
  public confirmPasswordReset(
    @Body(new ZodValidationPipe(AuthPasswordResetConfirmDtoSchema))
    passwordResetConfirmDto: AuthPasswordResetConfirmDto,
  ) {
    return this.authService.confirmPasswordReset(passwordResetConfirmDto);
  }
}
