import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@app/modules/user/services';
import { Payload } from '@app/modules/user/types';
import { UserTokensEntity } from '@app/modules/user/entities';

@Injectable()
export class OnlyAuthorizedGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const accessToken: string | undefined = req.cookies['access_token'];

    if (!accessToken) {
      return false;
    }

    let payload: Payload;

    try {
      payload = await this.authService.verifyAccessToken(accessToken);
    } catch (e) {
      return false;
    }

    const userId: number = payload.sub;

    const tokens: UserTokensEntity | null =
      await this.authService.findTokensByAccessToken(userId, accessToken);

    if (!tokens) {
      return false;
    }

    req['user'] = {
      id: userId,
      role: payload.role,
    };

    return true;
  }
}
