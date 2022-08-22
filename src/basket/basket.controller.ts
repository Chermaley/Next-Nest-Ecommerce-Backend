import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';
import { CreateBasketProductDto } from './dto/create-basket-product.dto';

@Controller('basket')
export class BasketController {
  constructor(private basketService: BasketService) {}

  @UseGuards(AtGuard)
  @Get()
  getCart(@GetCurrentUserId() userId: number) {
    return this.basketService.getCartByUserId(userId);
  }

  @UseGuards(AtGuard)
  @Post('add')
  addItemToCart(
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateBasketProductDto,
  ) {
    return this.basketService.addToBasket(userId, dto);
  }
}
