import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/products.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
  ) {}

  async getProduct(id: number) {
    return await this.productRepository.findByPk(id, {
      include: { all: true },
    });
  }

  async getAllProducts(typeId?: number, limit = 10, page = 1) {
    const offset = page * limit - limit;
    let products;

    products = await this.productRepository.findAll({
      include: { all: true },
      limit,
      offset,
    });

    if (typeId) {
      products = await this.productRepository.findAll({
        where: { typeId: typeId },
        include: { all: true },
        limit,
        offset,
      });
    }

    return products;
  }
}
