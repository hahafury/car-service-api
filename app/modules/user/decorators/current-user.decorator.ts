import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUserPayload } from '@app/modules/user/types/current-user';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const req: Request = ctx.switchToHttp().getRequest();
    return req['user'];
  },
);
