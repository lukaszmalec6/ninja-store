export interface ICreateProducData {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  categoryId: string;
}

export interface IListProductQuery {
  page: number,
  category?: string | string[],
  name?: string;
}
