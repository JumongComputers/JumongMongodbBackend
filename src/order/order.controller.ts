import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/interfaces/auth-user.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /* =======================
     CREATE ORDER
  ======================= */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.userId, dto);
  }

  /* =======================
     GET MY ORDERS
  ======================= */
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findMyOrders(@CurrentUser() user: AuthUser) {
    return this.ordersService.findMyOrders(user.userId);
  }

  /* =======================
     GET SINGLE ORDER
  ======================= */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }
}
