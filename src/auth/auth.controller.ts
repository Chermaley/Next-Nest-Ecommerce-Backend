import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Response,
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
  async localSignIn(@Body() dto: CreateUserDto, @Response() res) {
    const tokens = await this.authService.localSignIn(dto);
    res.cookie('tokens', JSON.stringify(tokens), {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
      sameSite: 'strict',
      httpOnly: true,
    });
    res.send(tokens);
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  localSignUp(@Body() dto: CreateUserDto, @Response() res) {
    const tokens = this.authService.localSignUp(dto);

    res.cookie('tokens', JSON.stringify(tokens), {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
      sameSite: 'strict',
      httpOnly: true,
    });

    res.send(tokens);
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
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Response() res,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    res.cookie('tokens', JSON.stringify(tokens), {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
      sameSite: 'strict',
      httpOnly: true,
    });
    res.send(tokens);
  }
}
