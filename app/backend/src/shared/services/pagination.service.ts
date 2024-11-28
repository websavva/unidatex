import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

import { Pagination, PaginationParamsDto } from '@unidatex/dto';

@Injectable()
export class PaginationService {
  public async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    { page, perPage }: PaginationParamsDto,
  ) {
    const offset = (page - 1) * perPage;

    const items = await queryBuilder.offset(offset).limit(perPage).getMany();

    const totalCount = await queryBuilder.getCount();

    const pageCount = Math.ceil(totalCount / perPage);

    const pagination: Pagination = {
      page: Math.min(page, pageCount),
      perPage,
      totalCount,
      pageCount,
    };

    return {
      items,
      pagination,
    };
  }
}
