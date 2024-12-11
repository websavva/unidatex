import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CityEntity } from '#shared/entities/city.entity';
import { GeoSearchCitiesDto } from '@unidatex/dto';

@Injectable()
export class GeoService {
  constructor(
    @InjectRepository(CityEntity)
    public citiesRepository: Repository<CityEntity>,
  ) {}

  searchCities({ q, limit, country }: GeoSearchCitiesDto) {
    return this.citiesRepository
      .createQueryBuilder('city')
      .where('city.country = :country', {
        country,
      })
      .andWhere('LOWER(city.name) LIKE :nameToSearch', {
        nameToSearch: `%${q.toLowerCase()}%`,
      })
      .orderBy('city.name', 'ASC')
      .limit(limit)
      .getMany();
  }
}
