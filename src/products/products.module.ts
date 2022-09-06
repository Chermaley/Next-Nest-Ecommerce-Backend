import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/products.model';
import { ProductType } from './models/product-types.model';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import { BasketProduct } from '../basket/basket-product.model';
import { BasketModule } from '../basket/basket.module';
import { ProductComment } from './models/product-comments.model';
import { ProductTypesService } from "./services/product-types.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductTypesService],
  imports: [
    SequelizeModule.forFeature([
      Product,
      ProductType,
      BasketProduct,
      ProductComment,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => BasketModule),
    FilesModule,
  ],
})
export class ProductsModule {}
