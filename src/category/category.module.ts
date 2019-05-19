import {Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {PaginationModule} from '../_utils/pagination';
import {InjectableSymbols} from '../_utils/injectable';
import {Category} from './category.model';
import {bodyValidator} from '../_utils/middlewares';
import {CategoryService} from './category.service';
import {createCategorySchema} from './validators';
import {CategoryController} from './category.controller';

@Module({
  imports: [
    PaginationModule
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: InjectableSymbols.categoryRepository,
      useValue: Category,
    }
  ],
  exports: [CategoryService]
})
export class CategoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyValidator(createCategorySchema))
      .forRoutes({path: `category`, method: RequestMethod.POST})
  }
}
