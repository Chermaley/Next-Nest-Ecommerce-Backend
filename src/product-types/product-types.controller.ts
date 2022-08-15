import { Controller, Get } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductType } from './product-types.model';

@ApiTags('Линейки')
@Controller('product-types')
export class ProductTypesController {
  constructor(private productTypesService: ProductTypesService) {}

  @ApiOperation({
    summary: 'Получить все линейки',
  })
  @ApiResponse({ status: 200, type: [ProductType] })
  @Get()
  getAll() {
    return this.productTypesService.getAllProductTypes();
  }
}
