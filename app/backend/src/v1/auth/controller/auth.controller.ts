import {
  Controller,
  Post,
  UsePipes,
  Body,
  Query,
  UseFilters,
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

@Controller()
@UseFilters(JwtExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(AuthSignUpDtoSchema))
  @Post('/sign-up')
  public signUp(@Body() signUpDto: AuthSignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/sign-up/confirm')
  public confirmSignUp(
    @Query(new ZodValidationPipe(AuthSignUpConfirmDtoSchema))
    { token }: AuthSignUpConfirmDto,
  ) {
    return this.authService.confirmSignUp(token);
  }

  @UsePipes(new ZodValidationPipe(AuthLoginDtoSchema))
  @Post('/login')
  public logIn(@Body() loginDto: AuthLoginDto) {
    return this.authService.logIn(loginDto);
  }

  @UsePipes(new ZodValidationPipe(AuthPasswordResetDtoSchema))
  @Post('/password-reset')
  public requestPasswordReset(@Body() passwordResetDto: AuthPasswordResetDto) {
    return this.authService.requestPasswordReset(passwordResetDto);
  }

  @UsePipes(new ZodValidationPipe(AuthPasswordResetConfirmDtoSchema))
  @Post('/password-reset/confirm')
  public confirmPasswordReset(
    @Body()
    passwordResetConfirmDto: AuthPasswordResetConfirmDto,
  ) {
    return this.authService.confirmPasswordReset(passwordResetConfirmDto);
  }
}
