import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCommentDto {
  @ApiProperty({
    example: 'Матвей.',
    description: 'Имя автора.',
  })
  readonly author: string;

  @ApiProperty({
    example: 'Продукт очень хороший.',
    description: 'Текст комментария.',
  })
  readonly text: string;

  @ApiProperty({
    example: '1324.',
    description: 'Идентификатор продукта.',
  })
  readonly productId: number;

  @ApiProperty({
    example: '4.5',
    description: 'Оценка.',
  })
  readonly rating: number;
}
