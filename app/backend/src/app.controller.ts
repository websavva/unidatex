import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { AppService } from './app.service';
import { User } from './entities/user.entity';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users')
  async getAllUsers() {
    const keys = await this.cacheManager.store.keys();

    if (!keys.length) return null;

    const allItems = await this.cacheManager.store.mget(...keys);

    return allItems;
  }

  @Post('/users')
  createUser(@Body() newUserDto: { email: string }) {
    const newUser = new User();

    newUser.email = newUserDto.email;

    this.cacheManager.set(newUser.id, newUser, 60 * 1e3);

    return newUser;
  }
}
