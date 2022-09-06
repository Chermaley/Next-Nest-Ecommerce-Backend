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
import { User } from '../../users/users.model';
import { Message } from './message.model';

export enum ConsultationType {
  Support = 'Support',
  Cosmetic = 'Cosmetic',
}

export enum ConsultationStatus {
  Open = 'Open',
  Closed = 'Closed',
}

@Table({ createdAt: false })
export class Consultation extends Model<Consultation> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM({ values: Object.keys(ConsultationType) }),
  })
  type: ConsultationType;

  @Column({
    type: DataType.ENUM({ values: Object.keys(ConsultationStatus) }),
    defaultValue: ConsultationStatus.Open,
  })
  status: ConsultationStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => Message)
  messages: Message[];
}
