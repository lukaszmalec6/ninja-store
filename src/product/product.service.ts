import {Injectable, Inject} from '@nestjs/common';
import {InjectableSymbols} from '../_utils/injectable';
import {Product} from './product.model';
import {ICreateProducData, IListProductQuery} from './product.interfaces';
import {Category} from '../category';
import * as sequelize from 'sequelize';
import {PaginationService} from '../_utils/pagination';
import {IGetPaginatedResponse, IDeleteResponse, IAddResponse} from '../_utils/controller.response.interface';

@Injectable()
export class ProductService {
  private readonly itemsPerPage = 5;

  constructor(
    @Inject(InjectableSymbols.productRepository) private readonly productRepository: typeof Product,
    private readonly paginationService: PaginationService
  ) {}

  public async getProduct(productId: string): Promise<Product> {
    try {
      return await this.productRepository.scope(`list`).findOne({
        include: [{
          model: Category,
          attributes: [`name`, `id`]
        }],
        where: {id: productId}
      });
    } catch (error) {
      throw new Error(`Can't get product by id: ${productId}, ${error}`);
    }
  }

  public async addProduct(data: ICreateProducData): Promise<IAddResponse<Product>> {
    try {
      const values = [await new Product(data).save()];
      return {
        values,
        addedCount: values.length
      }
    } catch (error) {
      throw new Error(`Can't create product: ${JSON.stringify(data)}, ${error}`);
    }
  }

  public async deleteProduct(id: string): Promise<IDeleteResponse> {
    try {
      return {
        deletedCount: await this.productRepository.destroy({where: {id}})
      };
    } catch (error) {
      throw new Error(`Can't delete product by id: ${id}, ${error}`);
    }
  }

  public async list(params: IListProductQuery): Promise<IGetPaginatedResponse<Product>> {
    const {page, category, name} = params;
    const isArrCategory = Array.isArray(category);
    const addCategoryFilter = isArrCategory && !!category.length || !!category;
    const insertCategoryParam = () => {
      if (isArrCategory && !!category.length) {
        return (<string[]>category).map(c => `category=${c}`).join(`&`);
      }
      if (!!category) {
        return `category=${(category)}`;
      }
      return ``
    }
    try {
      const values = await this.productRepository.scope(`list`).findAll({
        include: [{
          model: Category,
          attributes: [],
          where: addCategoryFilter ? {name: category} : {},
          as: `category`
        }],
        limit: this.itemsPerPage + 1,
        offset: (page - 1) * this.itemsPerPage,
        where: !!name ? {name: {[sequelize.Op.iLike]: `%${name}%`}} : {},
        order: [[`createdAt`, `DESC`]]
      });

      return this.paginationService.paginate<Product>({
        page,
        url: `/product/list?${name ? `name=${name}&` : ``}${insertCategoryParam()}${isArrCategory ? `&` : ``}`,
        values,
        itemsPerPage: this.itemsPerPage
      });
    } catch (error) {
      throw new Error(`Can't get products: ${error}`);
    }
  }
}

