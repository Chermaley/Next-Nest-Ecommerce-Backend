import {
  Body,
  Controller,
  Get, Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './products.model';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Продукты')
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @ApiOperation({
    summary: 'Создание продукта.',
  })
  @ApiResponse({ status: 200, type: Product })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() productDto: CreateProductDto, @UploadedFile() image) {
    return this.productService.createProduct(productDto, image);
  }

  @ApiOperation({
    summary: 'Получить продукт',
  })
  @ApiResponse({ status: 200, type: Product })
  @Get('/:id')
  getProduct(@Param('id') id: number) {
    return this.productService.getProduct(id);
  }

  @ApiOperation({
    summary: 'Получить все продукты',
  })
  @ApiResponse({ status: 200, type: [Product] })
  @Get()
  getAll(@Query('typeId') typeId: number) {
    return this.productService.getAllProducts(typeId);
  }
}
