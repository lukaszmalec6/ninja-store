import {Injectable, Inject} from '@nestjs/common';
import {InjectableSymbols} from '../_utils/injectable';
import {Category} from './category.model';
import {IAddResponse, IGetPaginatedResponse, IDeleteResponse} from '../_utils/controller.response.interface';
import {PaginationService} from '../_utils/pagination';

@Injectable()
export class CategoryService {
  private readonly itemsPerPage = 5;

  constructor(
    @Inject(InjectableSymbols.categoryRepository) private readonly categoryRepository: typeof Category,
    private readonly paginationService: PaginationService
  ) {}

  public async addCategory(data: {name: string}): Promise<IAddResponse<Category>> {
    try {
      const values = [await new Category(data).save()];
      return {
        values,
        addedCount: values.length
      }
    } catch (error) {
      throw new Error(`Can't create category: ${JSON.stringify(data)}, ${error}`);
    }
  }

  public async list(page: number): Promise<IGetPaginatedResponse<Category>> {
    try {
      const values = await this.categoryRepository.findAll({
        limit: this.itemsPerPage + 1,
        offset: (page - 1) * this.itemsPerPage,
        order: [[`createdAt`, `DESC`]]
      });

      return this.paginationService.paginate<Category>({
        page,
        url: `/category/list?`,
        values,
        itemsPerPage: this.itemsPerPage
      });
    } catch (error) {
      throw new Error(`Can't get categories: ${error}`);
    }
  }
}
