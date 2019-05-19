import {Controller, Get, UseGuards, Query, Post, Body, Req, Delete, Param} from '@nestjs/common';
import {Roles} from '../_utils/decorators';
import {AuthGuard} from '@nestjs/passport';
import {JWTStrategySymbols} from '../auth/passport/jwt.strategy.symbols';
import {RolesGuard} from '../_utils/guards';
import {UserRole} from '../user';
import {IGetPaginatedResponse, IAddResponse, IDeleteResponse} from '../_utils/controller.response.interface';
import {Category} from './category.model';
import {CategoryService} from './category.service';

@Controller(`category`)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  @Post(`/`)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt), RolesGuard)
  public async addCategory(@Body() body: {name: string}): Promise<IAddResponse<Category>> {
    return this.categoryService.addCategory({...body});
  }
  
  @Get(`/list`)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  public async listOrders(@Query(`page`) queryPage: number): Promise<IGetPaginatedResponse<Category>> {
    return this.categoryService.list(+queryPage || 1);
  }
}
