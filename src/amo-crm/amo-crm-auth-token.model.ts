import {Column, DataType, Model, Table} from 'sequelize-typescript';
import {ApiProperty} from '@nestjs/swagger';

@Table({ updatedAt: false, createdAt: false })
export class AmoCrmAuthToken extends Model<AmoCrmAuthToken> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Код для авторизации в amoCrm!',
    description: 'Код для авторизации в amoCrm!',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  token: string;
}
