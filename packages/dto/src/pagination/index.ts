import { z } from 'zod';

import { numericStringOrNumber } from '../utils';

export const DEFAULT_PER_PAGE = 20;

export const paginationNumericParam = (defaultValue: number) =>
  numericStringOrNumber()
    .default(defaultValue)
    .pipe(z.coerce.number().int().positive().finite());

export const PaginationParamsDtoSchema = z.object({
  page: paginationNumericParam(1),
  perPage: paginationNumericParam(20),
});

export type PaginationParamsDto = z.infer<typeof PaginationParamsDtoSchema>;

export type Pagination = PaginationParamsDto & {
  pageCount: number;
  totalCount: number;
};
