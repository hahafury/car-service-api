import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '@app/modules/user/dto';
import * as bcrypt from 'bcrypt';
import * as process from 'process';
import {
  UserCredentialsEntity,
  UserEntity,
  UserProfileEntity,
  UserRoleEntity,
  UserTokensEntity,
} from '@app/modules/user/entities';
import {
  UserRepository,
  UserRoleRepository,
  UserTokensRepository,
} from '@app/modules/user/repositories';
import { Payload, RoleEnum, Tokens } from '@app/modules/user/types';
import { TokenService } from '@app/modules/user/services/token.service';
import { jwtConstants } from '@app/common/config';
import {
  UserAlreadyExist,
  WrongCredentials,
} from '@app/modules/user/exceptions';

@Injectable()
export class AuthService {
  private saltRounds: number = +process.env.BCRYPT_SALT_ROUNDS;

  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
    private userTokensRepository: UserTokensRepository,
    private userRoleRepository: UserRoleRepository,
  ) {}

  async register(registerData: RegisterUserDto): Promise<UserEntity> {
    const { password, email } = registerData;

    const user: UserEntity = await this.userRepository.findUserByEmail(email);

    if (user) {
      throw new UserAlreadyExist();
    }

    const hashedPassword: string = await bcrypt.hash(password, this.saltRounds);

    const credentials: Partial<UserCredentialsEntity> =
      this.generateCredentials(registerData, hashedPassword);

    const profile: Partial<UserProfileEntity> =
      this.generateProfile(registerData);

    const role: UserRoleEntity = await this.userRoleRepository.findOneBy({
      type: RoleEnum.CLIENT,
    });

    return this.userRepository.save({
      credentials: credentials,
      profile: profile,
      role: role,
    });
  }

  async login(loginData: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginData;

    const user: UserEntity = await this.userRepository.findUserByEmail(email, {
      credentials: true,
      role: true,
    });

    if (!user) {
      throw new WrongCredentials();
    }

    const hashedPassword: string = user.credentials.password;

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      hashedPassword,
    );

    if (!isPasswordValid) {
      throw new WrongCredentials();
    }

    return user;
  }

  private generateCredentials(
    registerData: RegisterUserDto,
    hashedPassword: string,
  ): Partial<UserCredentialsEntity> {
    const credentials: Partial<UserCredentialsEntity> = {
      email: registerData.email,
      password: hashedPassword,
      phone: registerData.phone,
    };
    return credentials;
  }

  private generateProfile(
    registerData: RegisterUserDto,
  ): Partial<UserProfileEntity> {
    const profile: Partial<UserProfileEntity> = {
      name: registerData.name,
      surname: registerData.surname,
    };
    return profile;
  }
}
