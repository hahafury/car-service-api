import { UnauthorizedException } from '@nestjs/common';

export class WrongCredentials extends UnauthorizedException {
  constructor() {
    super('Wrong email or password');
  }
}
