import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { UserEntity } from '@app/modules/user/entities';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  findUserByEmail(
    email: string,
    relations?: FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity> {
    return this.findOne({
      where: { credentials: { email: email } },
      relations: relations,
    });
  }
}
