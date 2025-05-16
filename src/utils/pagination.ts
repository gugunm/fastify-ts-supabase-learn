export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
  };
}

export function createPaginationResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number
): PaginationResponse<T> {
  return {
    data,
    pagination: {
      total,
      limit,
      offset,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    },
  };
}
