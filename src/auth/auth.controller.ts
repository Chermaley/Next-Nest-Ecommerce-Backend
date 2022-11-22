import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Response,
  HttpStatus, UsePipes,
} from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { GetCurrentUserId } from '../common/decorators';
import { GetCurrentUser } from '../common/decorators/get-current-user-decorator';
import { AtGuard, RtGuard } from '../common/guards';
import { ValidationPipe } from "../common/pipes";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signIn')
  @HttpCode(HttpStatus.OK)
  async localSignIn(@Body() dto: CreateUserDto, @Response() res) {
    const tokens = await this.authService.localSignIn(dto);
    res.send(tokens);
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async localSignUp(@Body() dto: CreateUserDto, @Response() res) {
    const tokens = await this.authService.localSignUp(dto);
    res.send(tokens);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number, @Response() res) {
    await this.authService.logout(userId);
    res.clearCookie('tokens');
    res.end();
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
    res.send(tokens);
  }
}
