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

const getTokenFromSocket = (socket: Socket): string | null => {
  try {
    if (socket.handshake.headers.authorization) {
      return socket.handshake.headers.authorization.split(' ')[1];
    }
    const tokensJson = socket.handshake.headers.cookie
      .split('; ')
      .find((cookie: string) => cookie.startsWith('tokens'))
      .split('=')[1];
    return JSON.parse(decodeURIComponent(tokensJson)).accessToken;
  } catch {
    return null;
  }
};

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
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
      const accessToken = getTokenFromSocket(socket);

      const user = await this.authService.getUserFromJwt(accessToken);

      if (!user) {
        return this.handleDisconnect(socket);
      }

      await this.userService.updateUserById(user.id, {
        chatSocketId: socket.id,
      });

      const isConsult = user.roles.some((role) => role.value === 'ADMIN');

      if (!isConsult) {
        return await this.sendConsultations(socket, [socket.id], user.id);
      }
      socket.join('consults');
      return await this.sendConsultations(socket, ['consults']);
    } catch {
      this.handleDisconnect(socket);
    }
  }

  async sendConsultations(socket: Socket, to: string[], userId?: number) {
    const consultations = await this.consultationService.getOpenConsultations(
      userId,
    );
    this.server.to(to).emit('consultations', consultations);
  }

  async handleDisconnect(socket: Socket) {
    socket.leave('consults');
    await this.consultationService.leaveConsultation(socket.id);
    const accessToken = getTokenFromSocket(socket);
    if (!accessToken) return;
    const user = await this.authService.getUserFromJwt(accessToken);
    if (user) {
      await this.userService.updateUserById(user.id, {
        chatSocketId: null,
      });
    }
  }

  @SubscribeMessage('createConsultation')
  async createConsultation(socket: Socket, userId) {
    console.log('create');
    const consultation = await this.consultationService.createConsultation(
      userId,
    );
    if (consultation) {
      await this.sendConsultations(socket, ['consults']);
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
    console.log(activeUsersInConsultations.length);
    activeUsersInConsultations.forEach((consultation) => {
      this.server.to(consultation.socketId).emit('newMessage', message);
    });
  }

  @SubscribeMessage('joinConsultationConsult')
  async joinConsultationConsult(
    @ConnectedSocket() socket: Socket,
    @MessageBody() consultationId: number,
  ) {
    const accessToken = getTokenFromSocket(socket);
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
      .emit('consultationClosed');
    await this.sendConsultations(socket, [creator.chatSocketId], creator.id);
    await this.sendConsultations(socket, ['consults']);
  }

  @SubscribeMessage('leaveConsultation')
  leaveConversation(socket: Socket) {
    this.consultationService.leaveConsultation(socket.id);
  }
}
