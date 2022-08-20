import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Basket } from '../basket/basket.model';
import { Product } from './products.model';

@Table({ tableName: 'basket_product', createdAt: false, updatedAt: false })
export class BasketProduct extends Model<BasketProduct> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Basket)
  basketId: number;

  @BelongsTo(() => Basket)
  basket: Basket;

  @ForeignKey(() => Product)
  productId: number;

  @BelongsTo(() => Product)
  product: Product;
}
