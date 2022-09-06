import { ApiProperty } from '@nestjs/swagger';

export class CreateProductTypeDto {
  @ApiProperty({
    example: 'Увлажняющие средства.',
    description: 'Название линейки.',
  })
  readonly name: string;
}
