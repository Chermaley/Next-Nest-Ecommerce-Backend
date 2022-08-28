import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConsultationService } from './services/consultation.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';
import { GetCurrentUser } from '../common/decorators/get-current-user-decorator';

@ApiTags('Чат')
@Controller('chat')
export class ChatController {
  constructor(private consultationsService: ConsultationService) {}

  @Get('closedConsultations')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getClosedConsultations(
    @GetCurrentUserId() userId,
    @GetCurrentUser('roles') roles,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.consultationsService.getClosedConsultations(
      userId,
      roles,
      page,
      pageSize,
    );
  }

  @Get('openConsultation')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getActiveUserConsultations(@GetCurrentUserId() userId) {
    return await this.consultationsService.getOpenConsultations(userId);
  }
}
