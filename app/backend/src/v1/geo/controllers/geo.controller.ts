import { Controller, Get, Query } from '@nestjs/common';
import { GeoSearchCitiesDtoSchema, GeoSearchCitiesDto } from '@unidatex/dto';

import { ZodValidationPipe } from '#shared/pipes/zod-validation.pipe';

import { GeoService } from '../services/geo.service';

@Controller()
export class GeoController {
  constructor(private geoService: GeoService) {}

  @Get('/cities/search')
  async searchCities(
    @Query(new ZodValidationPipe(GeoSearchCitiesDtoSchema))
    searchCitiesDto: GeoSearchCitiesDto,
  ) {
    return this.geoService.searchCities(searchCitiesDto);
  }
}
