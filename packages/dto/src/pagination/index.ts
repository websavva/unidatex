import { z } from 'zod';

export const DEFAULT_PER_PAGE = 20;

export const paginationNumericParam = (defaultValue: number) =>
  z
    .string()
    .regex(/^\d+$/, {
      message: 'Should be numeric',
    })
    .or(z.number())
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
