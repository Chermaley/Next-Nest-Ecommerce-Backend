import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { Basket } from '../basket/basket.model';
import { BasketProduct } from '../basket/basket-product.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(Basket) private basketRepository: typeof Basket,
  ) {}

  async createOrder({ basketId, userId }: CreateOrderDto) {
    const basket = await this.basketRepository.findByPk(basketId, {
      include: {
        model: BasketProduct,
      },
    });
    const amount = basket.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const order = await this.orderRepository.create({
      userId,
      amount,
    });
    await order.$set('products', basket.products);
    await basket.$set('products', []);
    return order;
  }

  getOrders(userId: number) {
    return this.orderRepository.findAll({
      where: { userId },
      order: [['id', 'DESC']],
      include: {
        all: true,
      },
    });
  }

  getOrder(id: number) {
    return this.orderRepository.findByPk(id, {
      include: {
        all: true,
      },
    });
  }
}
