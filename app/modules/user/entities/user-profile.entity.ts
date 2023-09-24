import { BaseEntity } from '@app/common/base';
import { Column, Entity } from 'typeorm';

@Entity('user_profile')
export class UserProfileEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  surname: string;
}
