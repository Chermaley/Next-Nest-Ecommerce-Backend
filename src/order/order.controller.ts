import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AtGuard } from '../common/guards';
import { OrderService } from './order.service';
import { GetCurrentUserId } from '../common/decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Product } from '../products/models/products.model';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(AtGuard)
  @Get()
  getOrders(@GetCurrentUserId() userId: number) {
    return this.orderService.getOrders(userId);
  }

  @Get('/:id')
  getProduct(@Param('id') id: number) {
    return this.orderService.getOrder(id);
  }

  @UseGuards(AtGuard)
  @Post()
  createOrder(
    @Body() dto: { basketId: number },
    @GetCurrentUserId() userId: number,
  ) {
    return this.orderService.createOrder({ ...dto, userId });
  }
}
