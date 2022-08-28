import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';

export const RolesGuard = (requiredRoles: string[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      try {
        const req = context.switchToHttp().getRequest();
        let token;
        const authHeader = req.header?.authorization;
        if (authHeader) {
          const bearer = authHeader.split(' ')[0];
          token = authHeader.split(' ')[1];
          if (bearer !== 'bearer' || !token) {
            throw new UnauthorizedException({
              message: 'Пользователь не авторизован.',
            });
          }
        } else {
          if (req instanceof Socket) {
            if (req.handshake.headers.cookie) {
              const tokensJson = req.handshake.headers.cookie
                .split('; ')
                .find((cookie: string) => cookie.startsWith('tokens'))
                .split('=')[1];
              token = JSON.parse(decodeURIComponent(tokensJson)).accessToken;
            }
            if (req.handshake.headers.authorization) {
              token = req.handshake.headers.authorization.split(' ')[1];
            }
          }
        }
        if (!requiredRoles) return true;
        const user = this.jwtService.verify(token, {
          secret: process.env.ACCESS_SECRET,
        });
        return user.roles.some((role) => requiredRoles.includes(role.value));
      } catch (e) {
        throw new HttpException(
          'Пользователь не авторизован',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  return mixin(RoleGuardMixin);
};
