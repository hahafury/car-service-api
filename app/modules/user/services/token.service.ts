import { Injectable } from '@nestjs/common';
import { Payload } from '@app/modules/user/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateToken(
    payload: Payload,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  verifyToken(token: string, secret: string): Promise<Payload> {
    return this.jwtService.verifyAsync(token, {
      secret: secret,
    });
  }
}
