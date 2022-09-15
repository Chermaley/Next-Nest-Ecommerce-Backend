import { Injectable } from '@nestjs/common';
import { User } from '../../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import {
  Consultation,
  ConsultationStatus,
  ConsultationType,
} from '../models/consultation.model';
import { Message } from '../models/message.model';
import { ActiveConsultation } from '../models/active-consultation.model';
import { JoinConsultationDto } from '../dto/join-consultation.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Role } from '../../roles/roles.model';
import { MessageAttachment } from '../models/messageAttachment';
import { CreateConsultationDto } from '../dto/create-consultation.dto';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectModel(Consultation)
    private consultationRepository: typeof Consultation,
    @InjectModel(ActiveConsultation)
    private activeConsultationRepository: typeof ActiveConsultation,
    @InjectModel(Message) private messageRepository: typeof Message,
    @InjectModel(MessageAttachment)
    private messageAttachmentRepository: typeof MessageAttachment,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  getConsultationById(
    conversationId: number,
  ): Promise<Consultation | undefined> {
    return this.consultationRepository.findOne({
      where: { id: conversationId },
      include: { model: User },
    });
  }

  async getClosedConsultations(
    userId: number,
    roles: Role[],
    page: number,
    pageSize: number,
  ): Promise<Consultation[] | undefined> {
    const offset = page * pageSize;
    const limit = pageSize;
    const isConsult = roles.some((role) => roles.includes(role));
    return this.consultationRepository.findAll({
      where: { status: ConsultationStatus.Closed },
      order: ['updatedAt'],
      include: !isConsult
        ? {
            model: User,
            where: {
              id: userId,
            },
          }
        : { model: User },
      offset,
      limit,
    });
  }

  async getOpenConsultations(
    userId?: number,
    type?: ConsultationType,
  ): Promise<Consultation[] | undefined> {
    console.log(';dsfs');
    return this.consultationRepository.findAll({
      where: { status: ConsultationStatus.Open, type: type ?? null },
      include: {
        model: User,
        where: { id: userId ?? null },
      },
    });
  }

  async createConsultation(
    dto: CreateConsultationDto,
  ): Promise<Consultation | undefined> {
    console.log(dto, 'user');
    const user = await this.userRepository.findByPk(dto.creatorId, {
      include: { model: Consultation },
    });
    // Only one consultation per user
    const openConsultations = await this.getOpenConsultations(
      user.id,
      dto.type,
    );
    console.log(openConsultations);
    if (openConsultations?.length === 0) {
      const consultation = await this.consultationRepository.create({
        creator: user,
        type: dto.type,
      });
      await consultation.$set('creator', user);
      return consultation;
    }
  }

  async joinConsultation(socketId: string, dto: JoinConsultationDto) {
    const { userId, consultationId } = dto;
    const activeConsultation = await this.activeConsultationRepository.findOne({
      where: { userId },
    });
    if (!activeConsultation) {
      return this.activeConsultationRepository.create({
        consultationId,
        userId,
        socketId,
      });
    } else {
      return activeConsultation.update({
        consultationId,
        userId,
        socketId,
      });
    }
  }

  async closeConsultation(consultationId: number) {
    const consultation = await this.consultationRepository.findByPk(
      consultationId,
    );
    await consultation.update({
      status: ConsultationStatus.Closed,
    });
    return consultation;
  }

  leaveConsultation(socketId: string) {
    return this.activeConsultationRepository.destroy({
      where: { socketId },
    });
  }

  getActiveUsersInConversations(
    consultationId: number,
  ): Promise<ActiveConsultation[]> {
    return this.activeConsultationRepository.findAll({
      where: { consultationId },
    });
  }

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    let { attachments, ...restDto } = dto;
    const message = await this.messageRepository.create(restDto);
    attachments = await this.messageAttachmentRepository.bulkCreate(
      attachments.map((attachment) => ({
        ...attachment,
        messageId: message.id,
      })),
    );
    await message.update('attachments', attachments);
    return message.reload({ include: { model: MessageAttachment } });
  }

  getMessages(consultationId: number): Promise<Message[]> {
    return this.messageRepository.findAll({
      where: { consultationId },
      order: [['createdAt', 'asc']],
      include: { model: MessageAttachment },
    });
  }
}
