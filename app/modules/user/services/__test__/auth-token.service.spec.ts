import { Test, TestingModule } from '@nestjs/testing';
import { UserTokensRepository } from '@app/modules/user/repositories';
import { TokenService } from '@app/modules/user/services';
import { AuthTokenService } from '@app/modules/user/services/auth-token.service';
import { UserEntity, UserTokensEntity } from '@app/modules/user/entities';
import { Payload, Tokens } from '@app/modules/user/types';
import { InvalidToken } from '@app/modules/user/exceptions';

describe('AuthService', () => {
  const userTokenRepositoryMock: Record<string, jest.Mock> = {
    save: jest.fn(),
    remove: jest.fn(),
  };
  const tokenServiceMock: Record<string, jest.Mock> = {
    verifyToken: jest.fn(),
  };
  let userTokensRepository: UserTokensRepository;
  let tokenService: TokenService;
  let authTokenService: AuthTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthTokenService,
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: UserTokensRepository, useValue: userTokenRepositoryMock },
      ],
    }).compile();

    userTokensRepository = module.get(UserTokensRepository);
    tokenService = module.get(TokenService);
    authTokenService = module.get(AuthTokenService);
  });

  it('should be defined', () => {
    expect(authTokenService).toBeDefined();
  });

  describe('saveTokens', () => {
    it('should save tokens to database', async () => {
      const user: UserEntity = new UserEntity();
      const createUserTokensData: Tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      const tokens: UserTokensEntity = new UserTokensEntity();
      tokens.accessToken = createUserTokensData.accessToken;
      tokens.refreshToken = createUserTokensData.refreshToken;
      tokens.user = user;

      const save: jest.SpyInstance = jest
        .spyOn(userTokensRepository, 'save')
        .mockResolvedValueOnce(tokens);

      const result: UserTokensEntity = await authTokenService.saveTokens(
        user,
        createUserTokensData,
      );

      expect(save).toHaveBeenCalled();
      expect(result).toEqual(tokens);
    });
  });

  describe('removeTokens', () => {
    it('should remove tokens from database', async () => {
      const tokens: UserTokensEntity = new UserTokensEntity();
      tokens.id = 2;
      const removedTokens: UserTokensEntity = { ...tokens, id: undefined };

      const remove: jest.SpyInstance = jest
        .spyOn(userTokensRepository, 'remove')
        .mockResolvedValueOnce(removedTokens);

      const result: UserTokensEntity =
        await authTokenService.removeTokens(tokens);

      expect(remove).toHaveBeenCalled();
      expect(result).toEqual(removedTokens);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify accessToken', async () => {
      const token: string = 'mysecretAccessToken';
      const payload: Payload = { sub: 1, role: 'client' };
      const verifyToken: jest.SpyInstance = jest
        .spyOn(tokenService, 'verifyToken')
        .mockResolvedValueOnce(payload);

      const result: Payload = await authTokenService.verifyAccessToken(token);

      expect(verifyToken).toHaveBeenCalled();
      expect(result).toEqual(payload);
    });
    it('should throw InvalidToken error if token not provided', async () => {
      const token: undefined = undefined;
      await expect(authTokenService.verifyAccessToken(token)).rejects.toThrow(
        InvalidToken,
      );
    });
    it('should throw InvalidToken error if token is invalid', async () => {
      const token: string = 'invalidtoken';
      const verifyToken: jest.SpyInstance = jest
        .spyOn(tokenService, 'verifyToken')
        .mockRejectedValue('invalid token');

      await expect(authTokenService.verifyAccessToken(token)).rejects.toThrow(
        InvalidToken,
      );
      expect(verifyToken).toHaveBeenCalled();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token', async () => {
      const token: string = 'myRefreshToken';
      const payload: Payload = { sub: 1, role: 'client' };
      const verifyToken: jest.SpyInstance = jest
        .spyOn(tokenService, 'verifyToken')
        .mockResolvedValueOnce(payload);

      const result: Payload = await authTokenService.verifyRefreshToken(token);

      expect(verifyToken).toHaveBeenCalled();
      expect(result).toEqual(payload);
    });
    it('should throw InvalidToken error if token not provided', async () => {
      const token: undefined = undefined;
      await expect(authTokenService.verifyRefreshToken(token)).rejects.toThrow(
        InvalidToken,
      );
    });
    it('should throw InvalidToken error if token is invalid', async () => {
      const token: string = 'invalidtoken';
      const verifyToken: jest.SpyInstance = jest
        .spyOn(tokenService, 'verifyToken')
        .mockRejectedValue('invalid token');

      await expect(authTokenService.verifyRefreshToken(token)).rejects.toThrow(
        InvalidToken,
      );
      expect(verifyToken).toHaveBeenCalled();
    });
  });
});
