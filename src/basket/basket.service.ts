import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Basket } from './basket.model';
import { Product } from '../products/models/products.model';
import { CreateBasketProductDto } from './dto/create-basket-product.dto';
import { BasketProduct } from './basket-product.model';
import { DeleteBasketProductDto } from './dto/delete-basket-product.dto';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket) private basketRepository: typeof Basket,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(BasketProduct)
    private basketProductRepository: typeof BasketProduct,
  ) {}

  async getBasketByUserId(userId) {
    return await this.basketRepository.findOne({
      where: userId,
      include: [BasketProduct],
      order: [['products', 'id']],
    });
  }

  async addToBasket(userId, dto: CreateBasketProductDto) {
    const basket = await this.getBasketByUserId(userId);
    const { price, productId, quantity } = dto;
    const subTotalPrice = quantity * price;
    const itemIndex = basket.products?.findIndex(
      (item) => item.productId == productId,
    );

    if (itemIndex > -1) {
      const item = basket.products[itemIndex];
      await item.update({
        quantity: item.quantity + quantity,
        subTotalPrice: item.quantity * item.price,
      });
    } else {
      const cartProduct = await this.basketProductRepository.create({
        ...dto,
        subTotalPrice,
      });
      await basket.$set('products', [...(basket.products ?? []), cartProduct]);
    }

    return basket;
  }

  async deleteFromBasket(userId, dto: DeleteBasketProductDto) {
    const product = await this.basketProductRepository.findByPk(dto.productId);

    if (product.quantity > 1) {
      await product.update({
        quantity: product.quantity - 1,
        subTotalPrice: product.subTotalPrice - product.price,
      });
    } else {
      await product.destroy();
    }

    return await this.getBasketByUserId(userId);
  }

  async createOrder() {}

  async create() {
    return await this.basketRepository.create();
  }
}
