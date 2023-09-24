import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { UserRoleEntity } from '@app/modules/user/entities/user-role.entity';
import { UserCredentialsEntity } from '@app/modules/user/entities/user-credentials.entity';
import { UserProfileEntity } from '@app/modules/user/entities/user-profile.entity';
import { UserTokensEntity } from '@app/modules/user/entities/user-tokens.entity';
import { BaseEntity } from '@app/common/base';

@Entity('user')
export class UserEntity extends BaseEntity {
  @ManyToOne(() => UserRoleEntity, { cascade: true })
  @JoinColumn()
  role: UserRoleEntity;

  @OneToOne(() => UserCredentialsEntity, { cascade: true })
  @JoinColumn()
  credentials: UserCredentialsEntity;

  @OneToOne(() => UserProfileEntity, { cascade: true })
  @JoinColumn()
  profile: UserProfileEntity;

  @OneToMany(() => UserTokensEntity, (token) => token.user, {
    cascade: true,
    nullable: true,
  })
  tokens: Relation<UserTokensEntity[]>;
}
