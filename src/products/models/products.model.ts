import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from './product-types.model';
import { ProductComment } from './product-comments.model';

interface ProductCreationAttrs {
  name: string;
  description: string;
  price: string;
  img: string;
}

@Table({})
export class Product extends Model<Product, ProductCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Название продукта.',
    description: 'Пиптидная омолаживающая сыворотка.',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'Описание продукта',
    description:
      'Омолаживающая биоактивная сыворотка обеспечивает интенсивный уход и борьбу с признаками старения на клеточном уровне. Пептиды ускоряют синтез коллагена и препятствуют его деградации. Полисахариды  и масла интенсивно увлажняют и восстанавливают гидролипидную мантию. Антиоксиданты и витамины в составе экстрактов оказывают противовоспалительное, антиоксидантное и омолаживающее действие. Сыворотка видимо улучшает внешний вид кожи, борется с патогенной микрофлорой, выравнивает цвет лица и замедляет образование морщин..',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ApiProperty({
    example: 'Цена продукта.',
    description: '200р',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @ApiProperty({
    example: 'Изображение продукта 1.',
    description: 'image.com',
  })
  @Column({
    type: DataType.STRING,
  })
  image1: string;

  @ApiProperty({
    example: 'Изображение продукта 2.',
    description: 'image.com',
  })
  @Column({
    type: DataType.STRING,
  })
  image2: string;

  @ApiProperty({
    example: 'Изображение продукта 3.',
    description: 'image.com',
  })
  @Column({
    type: DataType.STRING,
  })
  image3: string;

  @ApiProperty({
    example: '4.5',
    description: 'Оценка продукта.',
  })
  @Column({
    type: DataType.FLOAT,
  })
  rating: number;

  @ForeignKey(() => ProductType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  typeId: number;

  @HasMany(() => ProductComment)
  comments: ProductComment[];
}
