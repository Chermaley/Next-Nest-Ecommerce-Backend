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
import {JwtService} from '@nestjs/jwt';
import {Observable} from 'rxjs';
import {Socket} from 'socket.io';

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
          if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({
              message: 'Пользователь не авторизован.',
            });
          }
        } else {
          if (req instanceof Socket) {
            token = req?.handshake.auth.token;

            if (!token) {
              throw new UnauthorizedException({
                message: 'Пользователь не авторизован.',
              });
            }
          }
        }
        if (!requiredRoles) return true;
        const user = this.jwtService.verify(token, {
          secret: process.env.ACCESS_SECRET,
        });
        return user.roles.some((role) => requiredRoles.includes(role.value));
      } catch (e) {
        console.log(e);
        throw new HttpException(
          'Пользователь не авторизован',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  return mixin(RoleGuardMixin);
};
