import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestUser } from 'src/users/users.dto';

export const ReqUser = createParamDecorator((_data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest() as Request;

  return req.user as RequestUser;
});
