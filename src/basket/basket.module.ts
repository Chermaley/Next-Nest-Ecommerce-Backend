import { Module } from '@nestjs/common';
import { Product } from '../products/products.model';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Basket } from './basket.model';
import { BasketProduct } from './basket-product.model';

@Module({
  controllers: [BasketController],
  providers: [BasketService],
  imports: [SequelizeModule.forFeature([Basket, Product, BasketProduct])],
})
export class BasketModule {}