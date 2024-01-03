import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  UserCredentialsEntity,
  UserEntity,
  UserProfileEntity,
  UserRoleEntity,
  UserTokensEntity,
} from '@app/modules/user/entities';
import { PreAppointmentEntity } from '@app/modules/pre-appointment/entities';

export const DATABASE_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [
    UserEntity,
    UserProfileEntity,
    UserCredentialsEntity,
    UserRoleEntity,
    UserTokensEntity,
    PreAppointmentEntity,
  ],
  migrationsTableName: 'migration',
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  ssl: process.env.NODE_ENV === 'production',
};
