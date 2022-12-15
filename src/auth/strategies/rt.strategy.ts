import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Request} from 'express';
import {ForbiddenException, Injectable} from '@nestjs/common';
import {JwtPayloadWithRt} from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          try {
            const data = JSON.parse(request?.cookies['tokens']);
            if (!data.refreshToken) {
              return null;
            }
            return data.refreshToken;
          } catch (e) {
            return null;
          }
        },
      ]),
      secretOrKey: process.env.REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayloadWithRt) {
    let refreshTokenFromCookie;
    try {
      refreshTokenFromCookie = JSON.parse(
        request?.cookies['tokens'],
      ).refreshToken;
    } catch {}

    const refreshTokenFromHeader = request
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    const refreshToken = refreshTokenFromHeader || refreshTokenFromCookie;

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return { ...payload, refreshToken };
  }
}
