import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../auth.dto';

@Injectable()
export class JwtRefreshStategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly reflector: Reflector) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const refreshToken = req.cookies['refresh-token'];

          return refreshToken;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  validate(payload: TokenPayload) {
    const { iat, exp, ...tokenPayload } = payload;

    return tokenPayload;
  }
}
