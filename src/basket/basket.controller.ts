import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';
import { CreateBasketProductDto } from './dto/create-basket-product.dto';
import { DeleteBasketProductDto } from './dto/delete-basket-product.dto';

@Controller('basket')
export class BasketController {
  constructor(private basketService: BasketService) {}

  @UseGuards(AtGuard)
  @Get()
  getCart(@GetCurrentUserId() userId: number) {
    return this.basketService.getBasketByUserId(userId);
  }

  @UseGuards(AtGuard)
  @Post('add')
  addItemToBasket(
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateBasketProductDto,
  ) {
    return this.basketService.addToBasket(userId, dto);
  }

  @UseGuards(AtGuard)
  @Post('delete')
  deleteItemFromBasket(
    @GetCurrentUserId() userId: number,
    @Body() dto: DeleteBasketProductDto,
  ) {
    return this.basketService.deleteFromBasket(userId, dto);
  }

  @UseGuards(AtGuard)
  @Post('order')
  createOrder() {
    return this.basketService.createOrder();
  }
}
