import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/products.model';
import { Op } from 'sequelize';
import { CreateProductCommentDto } from '../dto/create-product-comment.dto';
import { ProductComment } from '../models/product-comments.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(ProductComment)
    private productCommentRepository: typeof ProductComment,
  ) {}

  async getProduct(id: number) {
    return await this.productRepository.findByPk(id, {
      include: {
        model: ProductComment,
        separate: true,
        order: [['createdAt', 'DESC']],
      },
    });
  }

  async leaveComment(dto: CreateProductCommentDto) {
    const product = await this.productRepository.findByPk(dto.productId, {
      include: { all: true },
    });
    const comment = await this.productCommentRepository.create(dto);
    if (dto.rating > 0) {
      product.rating = this._calculateRating(product);
    }
    product.comments.push(comment);
    return product.save();
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
      return term.length > 1
        ? await this.productRepository.findAll({
            where: {
              name: { [Op.like]: `%${term}%` },
            },
          })
        : [];
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

  private _calculateRating(product: Product) {
    const sum = product.comments.reduce((acc, comment) => {
      return acc + comment.rating;
    }, 0);
    return sum / product.comments.length;
  }
}
