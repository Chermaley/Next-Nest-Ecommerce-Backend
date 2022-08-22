import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Basket } from './basket.model';
import { Product } from '../products/products.model';
import { CreateBasketProductDto } from './dto/create-basket-product.dto';
import { BasketProduct } from './basket-product.model';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket) private basketRepository: typeof Basket,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(BasketProduct)
    private basketProductRepository: typeof BasketProduct,
  ) {}

  async getCartByUserId(userId) {
    return await this.basketRepository.findOne({
      where: userId,
      include: [BasketProduct],
    });
  }

  async addToBasket(userId, dto: CreateBasketProductDto) {
    const basket = await this.getCartByUserId(userId);
    const { price, productId, quantity } = dto;
    const subTotalPrice = quantity * price;
    const itemIndex = basket.products?.findIndex(
      (item) => item.productId == productId,
    );

    if (itemIndex > -1) {
      // const item = basket.products[itemIndex];
      // item.quantity = Number(item.quantity) + Number(quantity);
      // item.subTotalPrice = item.quantity * item.price;
      // cart.items[itemIndex] = item;
      // this.recalculateCart(cart);
      // return cart.save();
    } else {
      const cartProduct = await this.basketProductRepository.create({
        ...dto,
        subTotalPrice,
      });
      await basket.$set('products', [...(basket.products ?? []), cartProduct]);
    }

    return basket;
  }

  async create() {
    return await this.basketRepository.create();
  }
}
