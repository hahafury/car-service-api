import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '@app/common/base';
import { UserEntity } from '@app/modules/user/entities/user.entity';

@Entity('user_tokens')
export class UserTokensEntity extends BaseEntity {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user: Relation<UserEntity>;
}
