import { Test, TestingModule } from '@nestjs/testing';
import {
  UserRepository,
  UserRoleRepository,
} from '@app/modules/user/repositories';
import { AuthService } from '@app/modules/user/services';
import { LoginUserDto, RegisterUserDto } from '@app/modules/user/dto';
import {
  UserCredentialsEntity,
  UserEntity,
  UserRoleEntity,
} from '@app/modules/user/entities';
import {
  UserAlreadyExist,
  WrongCredentials,
} from '@app/modules/user/exceptions';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  const userRepositoryMock: Record<string, jest.Mock> = {
    findUserByEmail: jest.fn(),
    save: jest.fn(),
  };
  const userRoleRepositoryMock: Record<string, jest.Mock> = {
    findOneBy: jest.fn(),
  };

  let authService: AuthService;
  let userRepository: UserRepository;
  let userRoleRepository: UserRoleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: UserRoleRepository,
          useValue: userRoleRepositoryMock,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
    userRoleRepository = module.get(UserRoleRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register new user ', async () => {
      const registerData: RegisterUserDto = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        phone: '+384405551234',
        password: 'myStrongPassword',
        confirmPassword: 'myStrongPassword',
      };

      const userRole: UserRoleEntity = new UserRoleEntity();
      userRole.type = 'client';

      const user: UserEntity = new UserEntity();

      user.role = userRole;

      const findUserByEmail: jest.SpyInstance = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValueOnce(null);

      const findOneByRole: jest.SpyInstance = jest
        .spyOn(userRoleRepository, 'findOneBy')
        .mockResolvedValue(userRole);

      const saveUser: jest.SpyInstance = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce(user);

      const result: UserEntity = await authService.register(registerData);

      expect(findUserByEmail).toHaveBeenCalled();
      expect(findOneByRole).toHaveBeenCalled();
      expect(saveUser).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('should throw UserAlreadyExist error if user already exists', async () => {
      const registerData: RegisterUserDto = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        phone: '+384405551234',
        password: 'myStrongPassword',
        confirmPassword: 'myStrongPassword',
      };

      const user: UserEntity = new UserEntity();

      const findUserByEmail: jest.SpyInstance = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValueOnce(user);

      expect(findUserByEmail).toHaveBeenCalled();

      await expect(authService.register(registerData)).rejects.toThrow(
        UserAlreadyExist,
      );
    });
  });

  describe('login', () => {
    it('should logged in user', async () => {
      const loginData: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'myStrongPassword',
      };

      const credentials: UserCredentialsEntity = new UserCredentialsEntity();
      credentials.password = 'mockPassword';

      const user: UserEntity = new UserEntity();
      user.credentials = credentials;

      const findUserByEmail: jest.SpyInstance = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValueOnce(user);

      const compare: jest.SpyInstance = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(true as never);

      const result: UserEntity = await authService.login(loginData);

      expect(findUserByEmail).toHaveBeenCalled();
      expect(compare).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('should throw WrongCredentials error with non-existent user', async () => {
      const loginData: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'myStrongPassword',
      };

      const findUserByEmail: jest.SpyInstance = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValueOnce(null);

      expect(findUserByEmail).toHaveBeenCalled();

      await expect(authService.login(loginData)).rejects.toThrow(
        WrongCredentials,
      );
    });

    it('should throw WrongCredentials error with incorrect password', async () => {
      const loginData: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'myStrongPassword',
      };

      const credentials: UserCredentialsEntity = new UserCredentialsEntity();
      credentials.password = 'mockPassword';

      const user: UserEntity = new UserEntity();

      user.credentials = credentials;

      const findUserByEmail: jest.SpyInstance = jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValueOnce(user);

      const compare: jest.SpyInstance = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(false as never);

      expect(findUserByEmail).toHaveBeenCalled();
      expect(compare).toHaveBeenCalled();
      await expect(authService.login(loginData)).rejects.toThrow(
        WrongCredentials,
      );
    });
  });
});
