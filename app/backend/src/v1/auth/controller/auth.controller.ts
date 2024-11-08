import { Controller, Get, Post, UsePipes, Body } from '@nestjs/common';

import { AuthSignUpDtoSchema, AuthSignUpDto } from '@unidatex/dto';

import { ZodValidationPipe } from '#shared/pipes/zod-validation.pipe';
import { JwtService } from '#shared/modules/jwt.module';

@Controller()
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get('/login')
  public login() {
    return 'Hello World';
  }

  @UsePipes(new ZodValidationPipe(AuthSignUpDtoSchema))
  @Post('/sign-up')
  public signUp(@Body() signUpDto: AuthSignUpDto) {
    return signUpDto;
  }
}
