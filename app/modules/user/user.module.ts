import { Module } from '@nestjs/common';
import {
  AuthService,
  TokenService,
  UserService,
} from '@app/modules/user/services';
import {
  UserRepository,
  UserTokensRepository,
} from '@app/modules/user/repositories';
import { AuthController, UserController } from '@app/modules/user/controllers';
import { JwtModule } from '@nestjs/jwt';
import { OnlyAuthorizedGuard } from '@app/modules/user/guards';

@Module({
  imports: [JwtModule],
  providers: [
    UserService,
    AuthService,
    TokenService,
    UserRepository,
    UserTokensRepository,
    OnlyAuthorizedGuard,
  ],
  controllers: [UserController, AuthController],
  exports: [OnlyAuthorizedGuard],
})
export class UserModule {}
