import { Controller, Post, UsePipes, Body, Query } from '@nestjs/common';

import {
  AuthSignUpDtoSchema,
  AuthSignUpDto,
  AuthSignUpConfirmDto,
  AuthSignUpConfirmDtoSchema,
} from '@unidatex/dto';

import { ZodValidationPipe } from '#shared/pipes/zod-validation.pipe';

import { AuthService } from '../service/auth.service';

@Controller()
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
}
