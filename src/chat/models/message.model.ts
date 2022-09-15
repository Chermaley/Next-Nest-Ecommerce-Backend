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
import { Consultation } from './consultation.model';
import { MessageAttachment } from './messageAttachment';

@Table({ updatedAt: false })
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

  @HasMany(() => MessageAttachment)
  attachments: MessageAttachment[];

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
