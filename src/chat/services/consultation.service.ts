import { Injectable } from '@nestjs/common';
import { User } from '../../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Consultation, ConsultationStatus } from '../models/consultation.model';
import { Message } from '../models/message.model';
import { ActiveConsultation } from '../models/active-consultation.model';
import { JoinConsultationDto } from '../dto/join-consultation.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Role } from '../../roles/roles.model';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectModel(Consultation)
    private consultationRepository: typeof Consultation,
    @InjectModel(ActiveConsultation)
    private activeConsultationRepository: typeof ActiveConsultation,
    @InjectModel(Message) private messageRepository: typeof Message,
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

  // async getOpenUserConsultation(
  //   userId: number,
  // ): Promise<Consultation | undefined> {
  //   return this.consultationRepository.findOne({
  //     where: { status: ConsultationStatus.Open },
  //     include: {
  //       model: User,
  //       where: {
  //         id: userId,
  //       },
  //     },
  //   });
  // }

  async getOpenConsultations(
    userId?: number,
  ): Promise<Consultation[] | undefined> {
    return this.consultationRepository.findAll({
      where: { status: ConsultationStatus.Open },
      include: {
        model: User,
        where: userId
          ? {
              id: userId,
            }
          : {},
      },
    });
  }

  async createConsultation(
    creatorId: number,
  ): Promise<Consultation | undefined> {
    const user = await this.userRepository.findByPk(creatorId, {
      include: { model: Consultation },
    });
    // Only one consultation per user
    const openConsultations = await this.getOpenConsultations(user.id);
    if (openConsultations?.length === 0) {
      const consultation = await this.consultationRepository.create({
        creator: user,
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
      await this.activeConsultationRepository.destroy({
        where: { userId },
      });
      return this.activeConsultationRepository.create({
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

  createMessage(dto: CreateMessageDto): Promise<Message> {
    return this.messageRepository.create(dto);
  }

  getMessages(consultationId: number): Promise<Message[]> {
    return this.messageRepository.findAll({ where: { consultationId } });
  }
}
