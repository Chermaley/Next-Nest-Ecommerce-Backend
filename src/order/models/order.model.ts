import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/users.model';
import { BasketProduct } from '../../basket/basket-product.model';

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Delivered = 'Delivered',
  Rejected = 'Rejected',
}

@Table({ createdAt: false, updatedAt: false })
export class Order extends Model<Order> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM({ values: Object.keys(OrderStatus) }),
    defaultValue: OrderStatus.Pending,
  })
  status: OrderStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.INTEGER,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @HasMany(() => BasketProduct)
  products: BasketProduct[];
}
