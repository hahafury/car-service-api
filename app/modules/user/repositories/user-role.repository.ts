import { DataSource, Repository } from 'typeorm';
import { UserRoleEntity } from '@app/modules/user/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRoleRepository extends Repository<UserRoleEntity> {
  constructor(private dataSource: DataSource) {
    super(UserRoleEntity, dataSource.createEntityManager());
  }
}
