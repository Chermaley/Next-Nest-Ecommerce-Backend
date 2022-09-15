import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/products.model';
import { Op } from 'sequelize';

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

  async getAllProducts({
    term,
    typeId,
    limit = 10,
    page = 1,
  }: {
    term?: string;
    typeId?: number;
    limit?: number;
    page?: number;
  }) {
    const offset = page * limit - limit;

    if (typeof term === 'string') {
      console.log(term);
      return await this.productRepository.findAll({
        where: { ...(term.length ? { name: { [Op.like]: `%${term}%` } } : {}) },
      });
    }

    if (typeId) {
      return await this.productRepository.findAll({
        where: { typeId: typeId },
        include: { all: true },
        limit,
        offset,
      });
    }

    return await this.productRepository.findAll({
      include: { all: true },
      limit,
      offset,
    });
  }
}
