import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './products.model';

@Table({})
export class ProductComment extends Model<ProductComment> {
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

  @ApiProperty({
    example: '4.5',
    description: 'Оценка продукта.',
  })
  @Column({
    type: DataType.FLOAT,
  })
  rating: number;

  @ForeignKey(() => Product)
  productId: number;
}
