import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityEntity } from '#shared/entities/city.entity';

import { GeoController } from './controllers/geo.controller';
import { GeoService } from './services/geo.service';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  controllers: [GeoController],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
