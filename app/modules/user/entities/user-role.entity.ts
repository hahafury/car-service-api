import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/common/base';

@Entity('user_role')
export class UserRoleEntity extends BaseEntity {
  @Column()
  type: string;
}
