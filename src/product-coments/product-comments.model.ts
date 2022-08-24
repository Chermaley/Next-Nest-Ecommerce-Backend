import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../products/products.model';

interface ProductCommentCreationAttrs {
  name: string;
}

@Table({ tableName: 'product-comments' })
export class ProductComment extends Model<
  ProductComment,
  ProductCommentCreationAttrs
> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Дядя Стёпа.',
    description: 'Имя комментатора.',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  author: string;

  @ApiProperty({
    example: 'Дядя Стёпа.',
    description: 'Имя комментатора.',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @ForeignKey(() => Product)
  productId: number;
}
