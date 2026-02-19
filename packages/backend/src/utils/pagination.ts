import { FindOptions } from 'sequelize';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const parsePagination = (query: any, defaultSort = 'created_at'): PaginationParams => {
  return {
    page: Math.max(1, parseInt(query.page) || 1),
    limit: Math.min(100, Math.max(1, parseInt(query.limit) || 10)),
    sortBy: query.sortBy || defaultSort,
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
  };
};

export const paginateQuery = (params: PaginationParams): Pick<FindOptions, 'limit' | 'offset' | 'order'> => {
  return {
    limit: params.limit,
    offset: (params.page - 1) * params.limit,
    order: [[params.sortBy, params.sortOrder.toUpperCase()]],
  };
};

export const buildPaginationMeta = (total: number, params: PaginationParams) => {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.ceil(total / params.limit),
  };
};
