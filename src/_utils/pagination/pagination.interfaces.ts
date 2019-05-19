export interface IPaginationParams<T> {
  page: number,
  url: string,
  values: T[],
  itemsPerPage?: number
}