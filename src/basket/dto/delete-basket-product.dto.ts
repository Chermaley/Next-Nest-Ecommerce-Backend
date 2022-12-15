import {ApiProperty} from '@nestjs/swagger';

export class DeleteBasketProductDto {
  @ApiProperty({
    example: 'Id продукта.',
    description: '33',
  })
  readonly productId: number;
}
