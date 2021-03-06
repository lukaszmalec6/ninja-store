import {Injectable, Inject, forwardRef} from '@nestjs/common';
import {InjectableSymbols} from '../_utils/injectable';
import {Order} from './order.model';
import {PaginationService} from '../_utils/pagination';
import {IGetPaginatedResponse, IAddResponse} from 'src/_utils/controller.response.interface';
import {User, UserSerivce} from '../user';
import {Product} from '../product';
import {EmailSenderService} from '../_utils/email-sender';
import {ProductService} from '../product/product.service';
import * as sequelize from 'sequelize';
import {IAdminReportData, IAdminReportItem} from './order.interfaces';

@Injectable()
export class OrderService {
  private readonly itemsPerPage = 5;

  constructor(
    @Inject(InjectableSymbols.orderRepository) private readonly orderRepository: typeof Order,
    private readonly paginationService: PaginationService,
    private readonly emailSender: EmailSenderService,
    @Inject(forwardRef(() => UserSerivce)) private readonly userService: UserSerivce,
    private readonly productService: ProductService
  ) {}

  public async addOrder(data: {productId: string, userId?: string, user?: User}): Promise<IAddResponse<Order>> {
    const {user, productId, userId} = data;
    let userData: User;
    try {
      if (user) {
        userData = user;
      } else if (userId) {
        userData = await this.userService.getFull({id: userId})
      }
      const productData = await this.productService.getProduct(productId);
      const values = [await new Order({userId: userData.id, productId}).save()];
      this.emailSender.sendPostOrderEmail({
        email: userData.email,
        userName: userData.firstName,
        product: productData.name,
        price: productData.price
      })
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

  public async getAdminReportData(): Promise<IAdminReportData> {
    try {
      const data: IAdminReportItem[] = await this.orderRepository.sequelize.query(`
      select 
		    count("order"."productId") as "soldCount", 
		    "order"."productId", 
		    product."price" * count("order"."productId") as "moneyGained",
		    product."name"
	    from "order" 
	    inner join product on product."id" = "order"."productId"
	    where "order"."createdAt" < current_date and "order"."createdAt" > current_date - interval '1 day'
	    group by "order"."productId", product."price", product."name"
    `, {
          type: sequelize.QueryTypes.SELECT,
          raw: true
        });
      let bestsellers: IAdminReportItem[] = [];
      let earningsCount = 0;
      let totalSoldCount = 0;
      const bestSellerCount = Math.max(...data.map(r => r.soldCount));
      data.forEach(curr => {
        if (+curr.soldCount === bestSellerCount) {
          bestsellers.push(curr)
        }
        earningsCount += +curr.moneyGained
        totalSoldCount += +curr.soldCount
      })
      return {bestsellers, earningsCount, totalSoldCount}
    } catch (error) {
      throw new Error(`Can't get data for admin report: ${error.message}`)
    }
  }
}
