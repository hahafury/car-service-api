import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { UserEntity } from '@app/modules/user/entities';
import { FindOptionsRelations } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  getUserById(
    userId: number,
    relations?: FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: relations,
    });
  }
}
