import { z } from 'zod';

export const DEFAULT_PER_PAGE = 20;

export const paginationNumericParam = (defaultValue: number) =>
  z.number().int().positive().finite().default(defaultValue);

export const PaginationParamsDtoSchema = z.object({
  page: paginationNumericParam(1),
  perPage: paginationNumericParam(20),
});

export type PaginationParamsDto = z.infer<typeof PaginationParamsDtoSchema>;

export type Pagination = PaginationParamsDto & {
  pageCount: number;
  totalCount: number;
};
