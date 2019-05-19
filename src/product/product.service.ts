import {Injectable, Inject} from '@nestjs/common';
import {InjectableSymbols} from '../_utils/injectable';
import {Product} from './product.model';
import {ICreateProducData, IListProductQuery} from './product.interfaces';
import {Category} from '../category';
import * as sequelize from 'sequelize';
import {PaginationService} from '../_utils/pagination/pagination.service';
import {IGetPaginatedResponse, IDeleteResponse, IAddResponse} from 'src/_utils/controller.response.interface';

@Injectable()
export class ProductService {
  private readonly valuesPerPage = 5;

  constructor(
    @Inject(InjectableSymbols.productRepository) private readonly productRepository: typeof Product,
    private readonly paginationService: PaginationService
  ) {}

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
    const addCategoryFilter = Array.isArray(category) && !!category.length || !!category;

    const insertCategoryParam = () => {
      if (Array.isArray(category) && !!category.length || !!category) {
        return Array.isArray(category) ? category.map(c => `category=${c}`).join(`&`) : `category=${(category)}`
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
        limit: this.valuesPerPage + 1,
        offset: (page - 1) * this.valuesPerPage,
        where: !!name ? {name: {[sequelize.Op.iLike]: `%${name}%`}} : {},
        order: [[`createdAt`, `DESC`]]
      });

      return this.paginationService.paginate<Product>({
        page,
        url: `/product/list?${name ? `name=${name}&` : ``}${insertCategoryParam()}`,
        values,
        itemsPerPage: this.valuesPerPage
      });
    } catch (error) {
      throw new Error(`Can't get products: ${error}`);
    }
  }
}

