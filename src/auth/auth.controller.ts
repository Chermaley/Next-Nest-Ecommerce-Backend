import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { GetCurrentUserId } from '../common/decorators';
import { GetCurrentUser } from '../common/decorators/get-current-user-decorator';
import { AtGuard, RtGuard } from '../common/guards';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signIn')
  @HttpCode(HttpStatus.OK)
  async localSignIn(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.localSignIn(dto);
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  localSignUp(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.localSignUp(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
