import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/common/base';

@Entity('user_credentials')
export class UserCredentialsEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  pinCode: number;
}
