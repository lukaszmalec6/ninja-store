export interface IAddResponse<T> {
  addedCount: number,
  values: T[]
}

export interface IDeleteResponse {
  deletedCount: number
}

export interface IGetPaginatedResponse<T> {
  valuesCount: number;
  values: T[]
  nextPage?: string;
}