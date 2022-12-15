import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AtGuard } from '../common/guards';
import { OrderService } from './order.service';
import { GetCurrentUserId } from '../common/decorators';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(AtGuard)
  @Get()
  getOrders(@GetCurrentUserId() userId: number) {
    return this.orderService.getOrders(userId);
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
