import { Module } from '@nestjs/common';
import { ProductComentsController } from './product-coments.controller';
import { ProductCommentsService } from './product-comments.service';

@Module({
  controllers: [ProductComentsController],
  providers: [ProductCommentsService],
})
export class ProductCommentsModule {}
