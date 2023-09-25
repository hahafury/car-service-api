import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserTokensEntity } from '@app/modules/user/entities';

@Injectable()
export class UserTokensRepository extends Repository<UserTokensEntity> {
  constructor(private dataSource: DataSource) {
    super(UserTokensEntity, dataSource.createEntityManager());
  }
}
