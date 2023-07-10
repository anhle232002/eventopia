import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class OptionalJWT implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    if (request.headers.authorization) {
      const bearerToken = request.headers.authorization?.split(' ')[1];

      const user = await this.authService.verifyToken(bearerToken);

      request.user = user;
    }

    return true;
  }
}
