
import {Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {DBModule} from '../_utils/db';
import {InjectableSymbols} from '../_utils/injectable';
import {ProductService} from './product.service';
import {Product} from './product.model';
import {ProducController} from './product.controller';
import {bodyValidator} from '../_utils/middlewares';
import {createProductSchema} from './validators';
import {ConfigModule} from '../config';
import {PaginationModule} from '../_utils/pagination/pagination.module';

@Module({
  imports: [DBModule, ConfigModule, PaginationModule],
  controllers: [ProducController],
  providers: [
    ProductService,
    {
      provide: InjectableSymbols.productRepository,
      useValue: Product,
    }
  ],
  exports: [ProductService]
})
export class ProductModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyValidator(createProductSchema))
      .forRoutes({path: `product`, method: RequestMethod.POST})
  }
}
