import { Injectable } from '@nestjs/common';
import { UserEntity, UserTokensEntity } from '@app/modules/user/entities';
import { Payload, Tokens } from '@app/modules/user/types';
import { jwtConstants } from '@app/common/config';
import { UserTokensRepository } from '@app/modules/user/repositories';
import { TokenService } from '@app/modules/user/services/token.service';
import { InvalidToken } from '@app/modules/user/exceptions';

@Injectable()
export class AuthTokenService {
  // secret
  private accessSecret: string = jwtConstants.authentication.access.secret;
  private refreshSecret: string = jwtConstants.authentication.refresh.secret;

  // expires in
  private accessExpiresIn: string =
    jwtConstants.authentication.access.expiresIn;
  private refreshExpiresIn: string =
    jwtConstants.authentication.refresh.expiresIn;

  constructor(
    private userTokensRepository: UserTokensRepository,
    private tokenService: TokenService,
  ) {}
  saveTokens(user: UserEntity, tokens: Tokens): Promise<UserTokensEntity> {
    return this.userTokensRepository.save({
      ...tokens,
      user: user,
    });
  }

  removeTokens(userTokensEntity: UserTokensEntity): Promise<UserTokensEntity> {
    return this.userTokensRepository.remove(userTokensEntity);
  }

  updateAccessToken(
    userTokensEntity: UserTokensEntity,
    newAccessToken: string,
  ): Promise<UserTokensEntity> {
    userTokensEntity.accessToken = newAccessToken;
    return this.userTokensRepository.save(userTokensEntity);
  }

  findTokensByAccessToken(
    userId: number,
    accessToken: string,
  ): Promise<UserTokensEntity | null> {
    return this.userTokensRepository.findOneBy({
      accessToken: accessToken,
      user: {
        id: userId,
      },
    });
  }

  findTokensByRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<UserTokensEntity | null> {
    return this.userTokensRepository.findOneBy({
      refreshToken: refreshToken,
      user: {
        id: userId,
      },
    });
  }

  generateAccessToken(payload: Payload): Promise<string> {
    return this.tokenService.generateToken(
      payload,
      this.accessSecret,
      this.accessExpiresIn,
    );
  }

  generateRefreshToken(payload: Payload): Promise<string> {
    return this.tokenService.generateToken(
      payload,
      this.refreshSecret,
      this.refreshExpiresIn,
    );
  }

  verifyAccessToken(accessToken: string | undefined): Promise<Payload> {
    return this.verifyToken(accessToken, this.accessSecret);
  }

  verifyRefreshToken(refreshToken: string | undefined): Promise<Payload> {
    return this.verifyToken(refreshToken, this.refreshSecret);
  }

  getTokens(payload: Payload): Promise<[string, string]> {
    return Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
  }

  private async verifyToken(
    token: string | undefined,
    secret: string,
  ): Promise<Payload> {
    if (!token) {
      throw new InvalidToken();
    }

    try {
      return await this.tokenService.verifyToken(token, secret);
    } catch (e) {
      throw new InvalidToken();
    }
  }
}
