import { ForbiddenException } from '@nestjs/common';

export class InvalidToken extends ForbiddenException {
  constructor() {
    super('Invalid token');
  }
}
