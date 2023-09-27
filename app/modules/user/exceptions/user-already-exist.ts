import { UnauthorizedException } from '@nestjs/common';

export class UserAlreadyExist extends UnauthorizedException {
  constructor() {
    super('User with this email already exists');
  }
}
