export type Pagination = {
  skip: number;
  take: number;
};

export function getPagination(page: number, take: number): Pagination {
  const skip = take && page ? (page - 1) * take : 0;
  return { skip, take };
}
