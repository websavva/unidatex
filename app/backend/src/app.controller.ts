import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { AppService } from './app.service';
import { loadDatabaseConfig } from './config/database.config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(loadDatabaseConfig.KEY)
    private dbConfig: ConfigType<typeof loadDatabaseConfig>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/env')
  getEnv() {
    return this.dbConfig;
  }
}
