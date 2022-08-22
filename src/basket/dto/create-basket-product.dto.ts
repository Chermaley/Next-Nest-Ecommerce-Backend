import { ApiProperty } from '@nestjs/swagger';

export class CreateBasketProductDto {
  @ApiProperty({
    example: 'Id продукта.',
    description: '33',
  })
  readonly productId: number;

  readonly name: string;

  readonly quantity: number;

  readonly price: number;
}
