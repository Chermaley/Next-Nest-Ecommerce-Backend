import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './products.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    private fileService: FilesService,
  ) {}

  async createProduct(dto: CreateProductDto, image: any) {
    const fileName = await this.fileService.createFile(image);
    return await this.productRepository.create({
      ...dto,
      img: fileName,
    });
  }

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
