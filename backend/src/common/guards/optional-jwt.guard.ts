import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class OptionalJWT implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    if (request.headers.authorization) {
      const bearerToken = request.headers.authorization?.split(' ')[1];

      const user = await this.jwtService.verifyAsync(bearerToken, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });

      request.user = user;
    }

    return true;
  }
}
