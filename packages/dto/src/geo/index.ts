import { z } from 'zod';

import { Country } from '@unidatex/constants';

import { paginationNumericParam } from '../pagination';

export const GeoSearchCitiesDtoSchema = z.object({
  q: z.string().optional().default(''),
  limit: paginationNumericParam(5),
  country: z.nativeEnum(Country),
});

export type GeoSearchCitiesDto = z.infer<typeof GeoSearchCitiesDtoSchema>;
