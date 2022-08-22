import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types';
import { Request } from 'express';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          try {
            const data = JSON.parse(request?.cookies['tokens']);
            if (!data.accessToken) {
              return null;
            }
            return data.accessToken;
          } catch (e) {
            return null;
          }
        },
      ]),
      secretOrKey: process.env.ACCESS_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    console.log(payload);
    return payload;
  }
}
