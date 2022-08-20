import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as argon from 'argon2';
import { RolesService } from '../roles/roles.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private roleService: RolesService,
  ) {}

  async localSignIn(dto: CreateUserDto): Promise<Tokens> {
    const user = await this.validateUser(dto);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return this.getTokens(user.id, user.email);
  }

  async localSignUp(dto: CreateUserDto): Promise<Tokens> {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await argon.hash(dto.password);
    const user = await this.userService.createUser({
      ...dto,
      password: hashPassword,
    });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    await this.userService.updateUserById(userId, { refreshTokenHash: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access denied');
    const refreshTokensMatches = await argon.verify(
      user.refreshTokenHash,
      refreshToken,
    );
    if (!refreshTokensMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (user) {
      const passwordEquals = await argon.verify(
        user.password,
        userDto.password,
      );
      if (user && passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({
      detail: 'Некорректный email или пароль.',
    });
  }

  private async updateRtHash(userId: number, refreshToken: string) {
    const refreshTokenHash = await argon.hash(refreshToken);
    await this.userService.updateUserById(userId, { refreshTokenHash });
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          userId,
          email,
        },
        {
          secret: process.env.ACCESS_SECRET,
          expiresIn: 60 * 15,
        },
      ),
      await this.jwtService.signAsync(
        {
          userId,
          email,
        },
        {
          secret: process.env.REFRESH_SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
