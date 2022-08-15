import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductType } from './product-types.model';
import { CreateProductTypeDto } from './dto/create-product-type.dto';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectModel(ProductType)
    private productTypesRepository: typeof ProductType,
  ) {}

  async createProductType(dto: CreateProductTypeDto) {
    return await this.productTypesRepository.create(dto);
  }

  async getAllProductTypes() {
    return await this.productTypesRepository.findAll();
  }
}
