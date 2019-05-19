import {Controller, Post, UseGuards, Body, Get, Delete, Param, Query} from '@nestjs/common';
import {JWTStrategySymbols} from '../auth/passport/jwt.strategy.symbols';
import {ProductService} from './product.service';
import {RolesGuard} from '../_utils/guards';
import {Roles} from '../_utils/decorators';
import {UserRole} from '../user';
import {AuthGuard} from '@nestjs/passport';
import {ICreateProducData} from './product.interfaces';
import {Product} from './product.model';
import {IAddResponse, IDeleteResponse, IGetPaginatedResponse, IGetSimpleResponse} from '../_utils/controller.response.interface';
import {validate, ObjectSchema} from 'joi';

@Controller(`product`)
export class ProducController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @Post(`/`)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt), RolesGuard)
  public async addProduct(@Body() body: ICreateProducData): Promise<IAddResponse<Product>> {
    return this.productService.addProduct(body);
  }

  @Get(`/:productId`)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  public async getProductDetails(@Param(`productId`) id: string): Promise<IGetSimpleResponse<Product>> {
    return {
      valuesCount: 1,
      values: await this.productService.getProduct(id)
    }
  }

  @Delete(`/:productId`)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt), RolesGuard)
  public async deleteProduct(@Param(`productId`) id: string): Promise<IDeleteResponse> {
    return this.productService.deleteProduct(id);
  }

  @Get(`/list`)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  public async listProducts(
    @Query(`page`) queryPage: number,
    @Query(`category`) category: string | string[],
    @Query(`name`) name: string
  ): Promise<IGetPaginatedResponse<Product>> {
    return this.productService.list({page: +queryPage || 1, category, name})
  }

}
