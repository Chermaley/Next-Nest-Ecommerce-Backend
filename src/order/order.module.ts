import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { Basket } from '../basket/basket.model';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [SequelizeModule.forFeature([Order, Basket])],
})
export class OrderModule {}
