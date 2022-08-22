import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Basket } from './basket.model';
import { Product } from '../products/products.model';

@Table({ tableName: 'basket_product', createdAt: false, updatedAt: false })
export class BasketProduct extends Model<BasketProduct> {
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
  basketId: number;

  @ForeignKey(() => Product)
  productId: number;
}
