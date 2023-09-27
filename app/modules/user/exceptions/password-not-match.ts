import { BadRequestException } from '@nestjs/common';

export class PasswordNotMatch extends BadRequestException {
  constructor() {
    super('Password do not match');
  }
}
