import {Controller, Get, UseGuards, Query, Post, Body, Req} from '@nestjs/common';
import {OrderService} from './order.service';
import {Roles} from '../_utils/decorators';
import {AuthGuard} from '@nestjs/passport';
import {JWTStrategySymbols} from '../auth/passport/jwt.strategy.symbols';
import {RolesGuard} from '../_utils/guards';
import {UserRole} from '../user';
import {IGetPaginatedResponse, IAddResponse} from 'src/_utils/controller.response.interface';
import {Order} from './order.model';
import {Request} from '../_utils/request';

@Controller(`order`)
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Post(`/`)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  public async addOrder(
    @Body() body: {productId: string},
    @Req() req: Request
  ): Promise<IAddResponse<Order>> {
    return this.orderService.addOrder({...body, user: req.user});
  }


  @Post(`/admin`)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt), RolesGuard)
  public async addOrderByAdmin(@Body() body: {productId: string, userId: string}): Promise<IAddResponse<Order>> {
    return this.orderService.addOrder(body);
  }
  
  @Get(`/list`)
  @Roles(UserRole.admin)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt), RolesGuard)
  public async listOrders(@Query(`page`) queryPage: number): Promise<IGetPaginatedResponse<Order>> {
    return this.orderService.list({page: +queryPage || 1});
  }
}
