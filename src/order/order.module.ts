import {Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {OrderService} from './order.service';
import {PaginationModule} from '../_utils/pagination';
import {InjectableSymbols} from '../_utils/injectable';
import {Order} from './order.model';
import {bodyValidator} from '../_utils/middlewares';
import {createOrderSchema, createOrderByAdminSchema} from './validators';
import {OrderController} from './order.controller';

@Module({
  imports: [PaginationModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: InjectableSymbols.orderRepository,
      useValue: Order,
    }
  ],
})
export class OrderModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyValidator(createOrderSchema))
      .forRoutes({path: `order`, method: RequestMethod.POST})
      .apply(bodyValidator(createOrderByAdminSchema))
      .forRoutes({path: `order/admin`, method: RequestMethod.POST})
  }
}
