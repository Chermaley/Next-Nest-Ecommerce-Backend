import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './products.model';
import { ProductType } from '../product-types/product-types.model';
import { ProductTypesModule } from '../product-types/product-types.module';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    SequelizeModule.forFeature([Product, ProductType]),
    forwardRef(() => ProductTypesModule),
    forwardRef(() => AuthModule),
    FilesModule,
  ],
})
export class ProductsModule {}
