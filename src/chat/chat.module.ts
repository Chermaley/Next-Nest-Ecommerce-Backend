import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Consultation } from './models/consultation.model';
import { ActiveConsultation } from './models/active-consultation.model';
import { Message } from './models/message.model';
import { ConsultationService } from './services/consultation.service';
import { ChatGateway } from './chat.gateway';
import { User } from '../users/users.model';
import { UsersModule } from '../users/users.module';
import { ChatController } from './chat.controller';
import { MessageAttachment } from "./models/messageAttachment";

@Module({
  controllers: [ChatController],
  imports: [
    AuthModule,
    UsersModule,
    SequelizeModule.forFeature([
      Consultation,
      ActiveConsultation,
      Message,
      MessageAttachment,
      User,
    ]),
  ],
  providers: [ChatGateway, ConsultationService],
})
export class ChatModule {}
