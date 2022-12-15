import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './services/products.service';
import { Product } from './models/products.model';
import { ProductType } from './models/product-types.model';
import { ProductTypesService } from './services/product-types.service';
import { CreateProductCommentDto } from './dto/create-product-comment.dto';
import { GetCurrentUserId } from '../common/decorators';
import { AtGuard } from '../common/guards';
import { GetCurrentUser } from '../common/decorators/get-current-user-decorator';
import { User } from '../users/users.model';

@ApiTags('Продукты')
@Controller('products')
export class ProductsController {
  constructor(
    private productService: ProductsService,
    private productTypesService: ProductTypesService,
  ) {}

  @ApiOperation({
    summary: 'Получить продукт',
  })
  @ApiResponse({ status: 200, type: Product })
  @Get('/p/:id')
  getProduct(@Param('id') id: number) {
    return this.productService.getProduct(id);
  }

  @ApiOperation({
    summary: 'Оставить отзыв',
  })
  @UseGuards(AtGuard)
  @ApiResponse({ status: 200, type: Product })
  @Post('/p/:id/comment')
  leaveComment(
    @Param('id') productId: number,
    @Body() dto: { text: string; rating: number },
    @GetCurrentUser() user: User,
  ) {
    return this.productService.leaveComment({
      ...dto,
      author: user.email,
      productId,
    });
  }

  @ApiOperation({
    summary: 'Получить все продукты',
  })
  @ApiResponse({ status: 200, type: [Product] })
  @Get()
  getAll(@Query('typeId') typeId: number, @Query('term') term: string) {
    return this.productService.getAllProducts({ typeId, term });
  }

  @ApiOperation({
    summary: 'Получить все линейки',
  })
  @ApiResponse({ status: 200, type: [ProductType] })
  @Get('/types')
  getAllProductTypes() {
    return this.productTypesService.getAllProductTypes();
  }
}
