import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Payload } from '@app/modules/user/types';
import { UserTokensEntity } from '@app/modules/user/entities';
import { AuthTokenService } from '@app/modules/user/services/auth-token.service';

@Injectable()
export class OnlyAuthorizedGuard implements CanActivate {
  constructor(private authTokenService: AuthTokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const accessToken: string | undefined = req.cookies['access_token'];

    if (!accessToken) {
      return false;
    }

    const payload: Payload =
      await this.authTokenService.verifyAccessToken(accessToken);

    const userId: number = payload.sub;

    const tokens: UserTokensEntity | null =
      await this.authTokenService.findTokensByAccessToken(userId, accessToken);

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
