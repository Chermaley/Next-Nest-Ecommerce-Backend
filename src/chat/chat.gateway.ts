import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { ConsultationService } from './services/consultation.service';
import { JoinConsultationDto } from './dto/join-consultation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../roles/roles.guard';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { ConsultationType } from './models/consultation.model';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://one-lab.online',
    ],
    credentials: true,
    transports: ['websocket'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private authService: AuthService,
    private consultationService: ConsultationService,
    private userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    try {
      const accessToken = socket.handshake.auth.token;
      const user = await this.authService.getUserFromJwt(accessToken);
      if (!user) {
        return this.handleDisconnect(socket);
      }
      await this.userService.updateUserById(user.id, {
        chatSocketId: socket.id,
      });
      const isConsult = user.roles.some((role) => role.value === 'ADMIN');
      if (isConsult) {
        socket.join('consults');
        await this.sendConsultations({
          type: ConsultationType.Cosmetic,
          to: ['consults'],
        });
      }
    } catch (e) {
      this.handleDisconnect(socket);
    }
  }

  async sendConsultations({
    userId,
    type,
    to,
  }: {
    to: string[];
    userId?: number;
    type: ConsultationType;
  }) {
    const consultations = await this.consultationService.getOpenConsultations(
      userId,
      type,
    );
    this.server.to(to).emit('consultations', consultations);
  }

  async handleDisconnect(socket: Socket) {
    socket.leave('consults');
    await this.consultationService.leaveConsultation(socket.id);
    const accessToken = socket.handshake.auth.token;
    if (!accessToken) return;
    const user = await this.authService.getUserFromJwt(accessToken);
    if (user) {
      await this.userService.updateUserById(user.id, {
        chatSocketId: null,
      });
    }
  }

  @SubscribeMessage('createConsultation')
  async createConsultation(socket: Socket, dto: CreateConsultationDto) {
    const consultation = await this.consultationService.createConsultation(dto);
    if (consultation) {
      await this.sendConsultations({
        to: ['consults', socket.id],
        type: dto.type,
      });
      this.server.to(socket.id).emit('activeConsultation', consultation);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: CreateMessageDto,
  ) {
    const message = await this.consultationService.createMessage(dto);
    const consultation = await this.consultationService.getConsultationById(
      dto.consultationId,
    );
    const isConsult = dto.userId !== consultation.creator.id;
    const activeUsersInConsultations =
      await this.consultationService.getActiveUsersInConversations(
        dto.consultationId,
      );
    if (activeUsersInConsultations.length < 2) {
      const to = !isConsult ? 'consults' : consultation.creator.chatSocketId;
      if (to) {
        this.server.to(to).emit('newMessageInConsultation', message);
      }
    }
    activeUsersInConsultations.forEach((consultation) => {
      this.server.to(consultation.socketId).emit('newMessage', message);
    });
  }

  @SubscribeMessage('joinConsultationConsult')
  async joinConsultationConsult(
    @ConnectedSocket() socket: Socket,
    @MessageBody() consultationId: number,
  ) {
    const accessToken = socket.handshake.auth.token;
    const user = await this.authService.getUserFromJwt(accessToken);
    const activeConsultation = await this.consultationService.joinConsultation(
      socket.id,
      { consultationId, userId: user.id },
    );
    const messages = await this.consultationService.getMessages(
      activeConsultation.consultationId,
    );
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('joinConsultation')
  async joinConsultationUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: JoinConsultationDto,
  ) {
    const activeConsultation = await this.consultationService.joinConsultation(
      socket.id,
      dto,
    );
    const messages = await this.consultationService.getMessages(
      activeConsultation.consultationId,
    );
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('closeConsultation')
  @UseGuards(RolesGuard(['ADMIN', 'CONSULT']))
  async closeConsultation(socket: Socket, consultationId: number) {
    const consultation = await this.consultationService.closeConsultation(
      consultationId,
    );
    const creator = await this.userService.getUserById(consultation.creatorId);
    this.server
      .to([creator.chatSocketId, socket.id])
      .emit('consultationClosed', consultation);
    await this.sendConsultations({
      to: [creator.chatSocketId],
      userId: creator.id,
      type: ConsultationType.Support,
    });
  }

  @SubscribeMessage('leaveConsultation')
  leaveConversation(socket: Socket) {
    this.consultationService.leaveConsultation(socket.id);
  }
}
