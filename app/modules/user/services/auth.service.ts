import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '@app/modules/user/dto';
import * as bcrypt from 'bcrypt';
import * as process from 'process';
import {
  UserCredentialsEntity,
  UserEntity,
  UserProfileEntity,
  UserTokensEntity,
} from '@app/modules/user/entities';
import {
  UserRepository,
  UserTokensRepository,
} from '@app/modules/user/repositories';
import { Payload, Tokens } from '@app/modules/user/types';
import { TokenService } from '@app/modules/user/services/token.service';
import { jwtConstants } from '@app/common/config';

@Injectable()
export class AuthService {
  private saltRounds: number = +process.env.BCRYPT_SALT_ROUNDS;

  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
    private userTokensRepository: UserTokensRepository,
  ) {}

  async register(registerData: RegisterUserDto): Promise<UserEntity> {
    const { password, email } = registerData;

    const user: UserEntity = await this.userRepository.findUserByEmail(email);

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword: string = await bcrypt.hash(password, this.saltRounds);

    const credentials: Partial<UserCredentialsEntity> =
      this.generateCredentials(registerData, hashedPassword);

    const profile: Partial<UserProfileEntity> =
      this.generateProfile(registerData);

    const clientRoleId: number = 1;

    return this.userRepository.save({
      credentials: credentials,
      profile: profile,
      role: { id: clientRoleId },
    });
  }

  async login(loginData: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginData;

    const user: UserEntity = await this.userRepository.findUserByEmail(email, {
      credentials: true,
      role: true,
    });

    if (!user) {
      throw new BadRequestException('Wrong email or password');
    }

    const hashedPassword: string = user.credentials.password;

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      hashedPassword,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Wrong email or password');
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

  saveTokens(user: UserEntity, tokens: Tokens): Promise<UserTokensEntity> {
    return this.userTokensRepository.save({
      ...tokens,
      user: user,
    });
  }

  removeTokens(userTokensEntity: UserTokensEntity): Promise<UserTokensEntity> {
    return this.userTokensRepository.remove(userTokensEntity);
  }
  updateAccessToken(
    userTokensEntity: UserTokensEntity,
    newAccessToken: string,
  ): Promise<UserTokensEntity> {
    userTokensEntity.accessToken = newAccessToken;
    return this.userTokensRepository.save(userTokensEntity);
  }

  findTokensByAccessToken(
    userId: number,
    accessToken: string,
  ): Promise<UserTokensEntity | null> {
    return this.userTokensRepository.findOneBy({
      accessToken: accessToken,
      user: {
        id: userId,
      },
    });
  }

  findTokensByRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<UserTokensEntity | null> {
    return this.userTokensRepository.findOneBy({
      refreshToken: refreshToken,
      user: {
        id: userId,
      },
    });
  }
  generateAccessToken(payload: Payload): Promise<string> {
    const accessSecret: string = jwtConstants.authentication.access.secret;
    const accessExpiresIn: string =
      jwtConstants.authentication.access.expiresIn;

    return this.tokenService.generateToken(
      payload,
      accessSecret,
      accessExpiresIn,
    );
  }

  generateRefreshToken(payload: Payload): Promise<string> {
    const refreshSecret: string = jwtConstants.authentication.refresh.secret;
    const refreshExpiresIn: string =
      jwtConstants.authentication.refresh.expiresIn;

    return this.tokenService.generateToken(
      payload,
      refreshSecret,
      refreshExpiresIn,
    );
  }

  verifyAccessToken(accessToken: string): Promise<Payload> {
    const accessSecret: string = jwtConstants.authentication.access.secret;
    return this.tokenService.verifyToken(accessToken, accessSecret);
  }

  verifyRefreshToken(refreshToken: string): Promise<Payload> {
    const refreshSecret: string = jwtConstants.authentication.refresh.secret;
    return this.tokenService.verifyToken(refreshToken, refreshSecret);
  }
  getTokens(payload: Payload): Promise<[string, string]> {
    return Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
  }
}
