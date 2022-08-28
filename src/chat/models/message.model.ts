import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/users.model';
import { Consultation } from './consultation.model';

@Table({ tableName: 'messages', updatedAt: false })
export class Message extends Model<Message> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Привет!', description: 'Текст сообщения' })
  @Column({
    type: DataType.TEXT,
  })
  message: string;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => Consultation)
  consultationId: number;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  userId: number;
}
