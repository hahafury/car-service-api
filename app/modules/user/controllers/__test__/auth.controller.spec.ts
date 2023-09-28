import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@app/modules/user/controllers';
import { AuthService } from '@app/modules/user/services';
import { AuthTokenService } from '@app/modules/user/services/auth-token.service';
import { LoginUserDto, RegisterUserDto } from '@app/modules/user/dto';
import {
  InvalidToken,
  PasswordNotMatch,
  UserAlreadyExist,
  WrongCredentials,
} from '@app/modules/user/exceptions';
import {
  UserEntity,
  UserRoleEntity,
  UserTokensEntity,
} from '@app/modules/user/entities';
import { RoleEnum } from '@app/modules';
import { Message } from '@app/common/types/message.type';
import { Payload } from '@app/modules/user/types';

describe('AuthController', () => {
  const authServiceMock: Record<string, jest.Mock> = {
    login: jest.fn(),
    register: jest.fn(),
  };
  const authTokenServiceMock: Record<string, jest.Mock> = {
    getTokens: jest.fn(),
    saveTokens: jest.fn(),
    verifyRefreshToken: jest.fn(),
    findTokensByRefreshToken: jest.fn(),
    removeTokens: jest.fn(),
    generateAccessToken: jest.fn(),
    updateAccessToken: jest.fn(),
  };

  let authController: AuthController;
  let authTokenService: AuthTokenService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AuthTokenService, useValue: authTokenServiceMock },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
    authTokenService = module.get(AuthTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset all mocks after each test
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authTokenService).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginData: LoginUserDto = {
        email: 'test@gmail.com',
        password: 'strongPassword',
      };

      const response: any = {
        cookie: jest.fn(),
        json: jest.fn(),
      };

      const cookie: jest.SpyInstance = jest.spyOn(response, 'cookie');

      const json: jest.SpyInstance = jest
        .spyOn(response, 'json')
        .mockResolvedValue({ message: 'user successfully logged in' });

      const userRole: UserRoleEntity = new UserRoleEntity();
      userRole.type = RoleEnum.CLIENT;

      const user: UserEntity = new UserEntity();
      user.id = 1;
      user.role = userRole;

      const login: jest.SpyInstance = jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce(user);

      const getTokens: jest.SpyInstance = jest
        .spyOn(authTokenService, 'getTokens')
        .mockResolvedValueOnce(['accessToken', 'refreshToken']);

      const saveTokens: jest.SpyInstance = jest.spyOn(
        authTokenService,
        'saveTokens',
      );
      await authController.login(loginData, response);

      expect(login).toHaveBeenCalled();
      expect(getTokens).toHaveBeenCalled();
      expect(saveTokens).toHaveBeenCalled();
      expect(cookie).toBeCalledTimes(2);
      expect(json).toHaveBeenCalled();
    });
    it('should throw WrongCredentials error if user with the given email does not exist', async () => {
      const loginData: LoginUserDto = {
        email: 'notRegisteredEmail@gmail.com',
        password: 'strong password',
      };
      const response: any = {};
      const login: jest.SpyInstance = jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new WrongCredentials());

      await expect(authController.login(loginData, response)).rejects.toThrow(
        WrongCredentials,
      );
      expect(login).toHaveBeenCalled();
    });
    it("should throw WrongCredentials error if the provided password does not match the user's password", async () => {
      const loginData: LoginUserDto = {
        email: 'notRegisteredEmail@gmail.com',
        password: 'strong password',
      };
      const response: any = {};
      const login: jest.SpyInstance = jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new WrongCredentials());

      await expect(authController.login(loginData, response)).rejects.toThrow(
        WrongCredentials,
      );
      expect(login).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerData: RegisterUserDto = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        phone: '+384405551234',
        password: 'myStrongPassword',
        confirmPassword: 'myStrongPassword',
      };

      const user: UserEntity = new UserEntity();

      const register: jest.SpyInstance = jest
        .spyOn(authService, 'register')
        .mockResolvedValueOnce(user);

      const result: Message = await authController.register(registerData);

      expect(result).toEqual({
        message: 'user successfully registered',
      });
      expect(register).toHaveBeenCalled();
    });
    it('should throw PasswordNotMatch error if passwords do not match', async () => {
      const registerData: RegisterUserDto = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        phone: '+384405551234',
        password: 'myStrongPassword',
        confirmPassword: 'password',
      };
      await expect(authController.register(registerData)).rejects.toThrow(
        PasswordNotMatch,
      );
    });
    it('should throw UserAlreadyExist error if a user with the given email is already registered', async () => {
      const registerData: RegisterUserDto = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        phone: '+384405551234',
        password: 'myStrongPassword',
        confirmPassword: 'myStrongPassword',
      };
      const register: jest.SpyInstance = jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new UserAlreadyExist());

      await expect(authController.register(registerData)).rejects.toThrow(
        UserAlreadyExist,
      );

      expect(register).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const req: any = { cookies: { refresh_token: 'refreshToken' } };
      const res: any = {
        clearCookie: jest.fn(),
        json: jest.fn(),
      };
      const payload: Payload = { sub: 1, role: RoleEnum.CLIENT };
      const tokens: UserTokensEntity = new UserTokensEntity();
      const message: Message = { message: 'User successfully logged out' };

      const verifyRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'verifyRefreshToken')
        .mockResolvedValueOnce(payload);

      const findTokensByRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'findTokensByRefreshToken')
        .mockResolvedValueOnce(tokens);

      const removeTokens: jest.SpyInstance = jest
        .spyOn(authTokenService, 'removeTokens')
        .mockResolvedValueOnce(tokens);

      const clearCookie: jest.SpyInstance = jest.spyOn(res, 'clearCookie');

      const json: jest.SpyInstance = jest
        .spyOn(res, 'json')
        .mockResolvedValue(message);

      await authController.logout(req, res);

      expect(verifyRefreshToken).toHaveBeenCalled();
      expect(findTokensByRefreshToken).toHaveBeenCalled();
      expect(removeTokens).toHaveBeenCalled();
      expect(clearCookie).toBeCalledTimes(2);
      expect(json).toHaveBeenCalled();
    });
    it('should throw InvalidToken error if refresh token does not provided', async () => {
      const req: any = { cookies: {} };
      const res: any = {};

      const verifyRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'verifyRefreshToken')
        .mockRejectedValue(new InvalidToken());

      await expect(authController.logout(req, res)).rejects.toThrow(
        InvalidToken,
      );
      expect(verifyRefreshToken).toHaveBeenCalled();
    });
    it('should throw InvalidToken error if refresh token is invalid', async () => {
      const req: any = { cookies: { refresh_token: 'refreshToken' } };
      const res: any = {};

      const verifyRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'verifyRefreshToken')
        .mockRejectedValue(new InvalidToken());

      await expect(authController.logout(req, res)).rejects.toThrow(
        InvalidToken,
      );
      expect(verifyRefreshToken).toHaveBeenCalled();
    });
    it('should throw InvalidToken error if tokens do not found by refresh token', async () => {
      const req: any = { cookies: { refresh_token: 'refreshToken' } };
      const res: any = {};
      const payload: Payload = { sub: 1, role: RoleEnum.CLIENT };

      const verifyRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'verifyRefreshToken')
        .mockResolvedValueOnce(payload);

      const findTokenByRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'findTokensByRefreshToken')
        .mockResolvedValueOnce(null);

      await expect(authController.logout(req, res)).rejects.toThrow(
        InvalidToken,
      );
      expect(findTokenByRefreshToken).toHaveBeenCalled();
      expect(verifyRefreshToken).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should successfully refresh token', async () => {
      const req: any = { cookies: { refresh_token: 'refreshToken' } };
      const res: any = {
        cookie: jest.fn(),
        json: jest.fn(),
      };
      const tokens: UserTokensEntity = new UserTokensEntity();
      const payload: Payload = { sub: 1, role: RoleEnum.CLIENT };

      const verifyRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'verifyRefreshToken')
        .mockResolvedValueOnce(payload);

      const findTokensByRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'findTokensByRefreshToken')
        .mockResolvedValueOnce(tokens);

      const generateAccessToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'generateAccessToken')
        .mockResolvedValueOnce('newAccessToken');

      const updateAccessToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'updateAccessToken')
        .mockResolvedValueOnce(tokens);

      const cookie: jest.SpyInstance = jest.spyOn(res, 'cookie');

      const json: jest.SpyInstance = jest.spyOn(res, 'json');

      await authController.refresh(req, res);

      expect(verifyRefreshToken).toHaveBeenCalled();
      expect(findTokensByRefreshToken).toHaveBeenCalled();
      expect(generateAccessToken).toHaveBeenCalled();
      expect(updateAccessToken).toHaveBeenCalled();
      expect(cookie).toHaveBeenCalled();
      expect(json).toHaveBeenCalled();
    });
    it('should throw InvalidToken error if refresh token does not provided', async () => {
      const req: any = { cookies: {} };
      const res: any = {};

      const verifyRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'verifyRefreshToken')
        .mockRejectedValue(new InvalidToken());

      await expect(authController.refresh(req, res)).rejects.toThrow(
        InvalidToken,
      );
      expect(verifyRefreshToken).toHaveBeenCalled();
    });
    it('should throw InvalidToken error if refresh token is invalid', async () => {
      const req: any = { cookies: { refresh_token: 'refreshToken' } };
      const res: any = {};

      const verifyRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'verifyRefreshToken')
        .mockRejectedValue(new InvalidToken());

      await expect(authController.refresh(req, res)).rejects.toThrow(
        InvalidToken,
      );
      expect(verifyRefreshToken).toHaveBeenCalled();
    });
    it('should throw InvalidToken error if tokens do not found by refresh token', async () => {
      const req: any = { cookies: { refresh_token: 'refreshToken' } };
      const res: any = {};
      const payload: Payload = { sub: 1, role: RoleEnum.CLIENT };

      const verifyRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'verifyRefreshToken')
        .mockResolvedValueOnce(payload);

      const findTokenByRefreshToken: jest.SpyInstance = jest
        .spyOn(authTokenService, 'findTokensByRefreshToken')
        .mockResolvedValueOnce(null);

      await expect(authController.refresh(req, res)).rejects.toThrow(
        InvalidToken,
      );
      expect(findTokenByRefreshToken).toHaveBeenCalled();
      expect(verifyRefreshToken).toHaveBeenCalled();
    });
  });
});
