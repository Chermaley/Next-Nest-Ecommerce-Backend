import {
  BelongsToMany,
  Column,
  DataType, ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table
} from "sequelize-typescript";
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../roles/user-roles.model';
import { Role } from '../roles/roles.model';
import { Basket } from '../basket/basket.model';
import { Consultation } from '../chat/models/consultation.model';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({})
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Почтовый адресс пользователя.',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  email: string;

  @ApiProperty({ example: '123121u', description: 'Пароль пользователя.' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @ApiProperty({ example: true, description: 'Забанен пользователь или нет.' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  banned: boolean;

  @ApiProperty({ example: 'Пидор', description: 'Причина бана пользователя.' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasOne(() => Basket)
  basket: Basket;

  @ForeignKey(() => Basket)
  basketId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refreshTokenHash: string;

  @HasMany(() => Consultation)
  consultations: Consultation[];

  @Column({
    type: DataType.STRING,
  })
  chatSocketId: string;
}
