import {Injectable, Inject} from '@nestjs/common';
import {InjectableSymbols} from '../_utils/injectable';
import {Order} from './order.model';
import {PaginationService} from '../_utils/pagination';
import {IGetPaginatedResponse, IAddResponse} from 'src/_utils/controller.response.interface';
import {User} from '../user';
import {Product} from '../product';

@Injectable()
export class OrderService {
  private readonly itemsPerPage = 5;

  constructor(
    @Inject(InjectableSymbols.orderRepository) private readonly orderRepository: typeof Order,
    private readonly paginationService: PaginationService
  ) {}

  public async addOrder(data: {userId: string, productId: string}): Promise<IAddResponse<Order>> {
    try {
      const values = [await new Order(data).save()];
      return {
        values,
        addedCount: values.length
      }
    } catch (error) {
      throw new Error(`Can't create product: ${JSON.stringify(data)}, ${error}`);
    }
  }

  public async list(params: {page: number}): Promise<IGetPaginatedResponse<Order>> {
    const {page} = params;

    try {
      const values = await this.orderRepository.findAll({
        include: [User, Product],
        limit: this.itemsPerPage + 1,
        offset: (page - 1) * this.itemsPerPage,
        order: [[`createdAt`, `DESC`]]
      });

      return this.paginationService.paginate<Order>({
        page,
        url: `/order/list?`,
        values,
        itemsPerPage: this.itemsPerPage
      });
    } catch (error) {
      throw new Error(`Can't get orders: ${error}`);
    }
  }
}
