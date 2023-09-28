import { Test, TestingModule } from '@nestjs/testing';
import { AuthTokenService } from '@app/modules/user/services/auth-token.service';
import { OnlyAuthorizedGuard, RoleEnum } from '@app/modules';
import { ExecutionContext } from '@nestjs/common';
import { Payload } from '@app/modules/user/types';
import { InvalidToken } from '@app/modules/user/exceptions';
import { UserTokensEntity } from '@app/modules/user/entities';

describe('OnlyAuthorizedGuard', () => {
  const authTokenServiceMock: Record<string, jest.Mock> = {
    verifyAccessToken: jest.fn(),
    findTokensByAccessToken: jest.fn(),
  };
  const mockExecutionContext: Partial<
    Record<
      jest.FunctionPropertyNames<ExecutionContext>,
      jest.MockedFunction<any>
    >
  > = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn(),
      getResponse: jest.fn(),
    }),
  };

  let authTokenService: AuthTokenService;
  let onlyAuthorizedGuard: OnlyAuthorizedGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnlyAuthorizedGuard,
        {
          provide: AuthTokenService,
          useValue: authTokenServiceMock,
        },
      ],
    }).compile();

    authTokenService = module.get<AuthTokenService>(AuthTokenService);
    onlyAuthorizedGuard = module.get<OnlyAuthorizedGuard>(OnlyAuthorizedGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authTokenService).toBeDefined();
    expect(onlyAuthorizedGuard).toBeDefined();
  });
  it('should give access to resource', async () => {
    const payload: Payload = { sub: 1, role: RoleEnum.CLIENT };
    const tokens: UserTokensEntity = new UserTokensEntity();

    const getRequest: jest.SpyInstance = jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue({ cookies: { access_token: 'validAccessToken' } });

    const verifyAccessToken: jest.SpyInstance = jest
      .spyOn(authTokenService, 'verifyAccessToken')
      .mockResolvedValueOnce(payload);

    const findTokensByAccessToken: jest.SpyInstance = jest
      .spyOn(authTokenService, 'findTokensByAccessToken')
      .mockResolvedValueOnce(tokens);

    const result: boolean = await onlyAuthorizedGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toEqual(true);
    expect(getRequest).toHaveBeenCalled();
    expect(verifyAccessToken).toHaveBeenCalled();
    expect(findTokensByAccessToken).toHaveBeenCalled();
  });

  it('should throw ForbiddenResource if no access token is provided', async () => {
    const getRequest: jest.SpyInstance = jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue({ cookies: { access_token: undefined } });

    const result: boolean = await onlyAuthorizedGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toEqual(false);
    expect(getRequest).toHaveBeenCalled();
  });

  it('should throw ForbiddenResource if tokens was not found in database', async () => {
    const payload: Payload = { sub: 1, role: RoleEnum.CLIENT };
    const getRequest: jest.SpyInstance = jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue({ cookies: { access_token: 'accessToken' } });

    const verifyAccessToken: jest.SpyInstance = jest
      .spyOn(authTokenService, 'verifyAccessToken')
      .mockResolvedValueOnce(payload);

    const findTokensByAccessToken: jest.SpyInstance = jest
      .spyOn(authTokenService, 'findTokensByAccessToken')
      .mockResolvedValueOnce(null);

    const result: boolean = await onlyAuthorizedGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toEqual(false);
    expect(getRequest).toHaveBeenCalled();
    expect(verifyAccessToken).toHaveBeenCalled();
    expect(findTokensByAccessToken).toHaveBeenCalled();
  });

  it('should throw ForbiddenResource if access token is invalid', async () => {
    const getRequest: jest.SpyInstance = jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue({ cookies: { access_token: 'invalidAccessToken' } });

    const verifyAccessToken: jest.SpyInstance = jest
      .spyOn(authTokenService, 'verifyAccessToken')
      .mockRejectedValue(new InvalidToken());

    await expect(
      onlyAuthorizedGuard.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(InvalidToken);
    expect(getRequest).toHaveBeenCalled();
    expect(verifyAccessToken).toHaveBeenCalled();
  });
});
