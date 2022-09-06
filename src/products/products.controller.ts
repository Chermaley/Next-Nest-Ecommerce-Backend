import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './services/products.service';
import { Product } from './models/products.model';
import { ProductType } from "./models/product-types.model";
import { ProductTypesService } from "./services/product-types.service";

@ApiTags('Продукты')
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService, private productTypesService: ProductTypesService) {}

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

  @ApiOperation({
    summary: 'Получить все линейки',
  })
  @ApiResponse({ status: 200, type: [ProductType] })
  @Get('types')
  getAllProductTypes() {
    return this.productTypesService.getAllProductTypes();
  }
}
