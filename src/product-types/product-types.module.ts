import { forwardRef, Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '../products/products.model';
import { ProductType } from './product-types.model';
import { ProductsModule } from '../products/products.module';
import { ProductTypesController } from './product-types.controller';

@Module({
  providers: [ProductTypesService],
  controllers: [ProductTypesController],
  imports: [
    SequelizeModule.forFeature([Product, ProductType]),
    forwardRef(() => ProductsModule),
  ],
})
export class ProductTypesModule {}
