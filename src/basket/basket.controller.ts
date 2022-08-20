import { Controller, Post } from '@nestjs/common';
import { BasketService } from './basket.service';

@Controller('basket')
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Post()
  createCart() {
    return this.basketService.create();
  }

  @Post()
  addItemToCart() {
    return this.basketService.create();
  }
}
