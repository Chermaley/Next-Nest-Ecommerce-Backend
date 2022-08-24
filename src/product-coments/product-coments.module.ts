import { Module } from '@nestjs/common';
import { ProductComentsController } from './product-coments.controller';
import { ProductComentsService } from './product-coments.service';

@Module({
  controllers: [ProductComentsController],
  providers: [ProductComentsService]
})
export class ProductComentsModule {}
