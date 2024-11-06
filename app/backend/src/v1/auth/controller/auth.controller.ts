import { Controller, Get } from '@nestjs/common';

@Controller()
export class AuthController {
  @Get('/login')
  public login() {
    return 'Hello World';
  }
}
