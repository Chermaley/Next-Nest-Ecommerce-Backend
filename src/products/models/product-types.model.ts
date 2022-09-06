import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './products.model';

interface ProductTypeCreationAttrs {
  name: string;
}

@Table({})
export class ProductType extends Model<ProductType, ProductTypeCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Увлажняющие средства.',
    description: 'Название линейки.',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Product)
  products: Product[];
}
