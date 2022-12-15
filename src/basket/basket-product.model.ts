import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Basket } from './basket.model';
import { Product } from '../products/models/products.model';
import { Order } from '../order/models/order.model';

interface BasketProductCreationAttrs {
  name: string;
  quantity: number;
  price: number;
  subTotalPrice: number;
  basketId: number;
  productId: number;
}

@Table({ createdAt: false, updatedAt: false })
export class BasketProduct extends Model<
  BasketProduct,
  BasketProductCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
  })
  subTotalPrice: number;

  @ForeignKey(() => Basket)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  basketId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  productId: number;

  @ForeignKey(() => Order)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  orderId: number;
}
