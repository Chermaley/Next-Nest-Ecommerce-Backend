import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { BasketProduct } from './basket-product.model';
import { User } from '../users/users.model';

@Table({ createdAt: false, updatedAt: false })
export class Basket extends Model<Basket> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => BasketProduct)
  products: BasketProduct[];
}
