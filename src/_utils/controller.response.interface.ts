export interface IAddResponse<T> {
  addedCount: number,
  values: T[]
}

export interface IDeleteResponse {
  deletedCount: number
}

export interface IGetSimpleResponse<T> {
  valuesCount: number;
  values: T
}

export interface IGetPaginatedResponse<T> {
  valuesCount: number;
  values: T[]
  nextPage?: string;
}