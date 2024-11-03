import { Body, Controller, Get, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { User } from './entities/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users')
  getAllUsers() {
    return this.usersRepository.find();
  }

  @Post('/users')
  createUser(@Body() newUserDto: { name: string }) {
    const newUser = new User();

    newUser.name = newUserDto.name;

    return this.usersRepository.save(newUser);
  }
}
