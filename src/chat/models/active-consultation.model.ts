import {Column, DataType, ForeignKey, Model, Table,} from 'sequelize-typescript';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '../../users/users.model';
import {Consultation} from './consultation.model';

@Table({ createdAt: false })
export class ActiveConsultation extends Model<ActiveConsultation> {
  @ApiProperty({ example: '1', description: 'Уникальный id' })
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
  socketId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @ForeignKey(() => Consultation)
  @Column({
    type: DataType.INTEGER,
  })
  consultationId: number;
}
