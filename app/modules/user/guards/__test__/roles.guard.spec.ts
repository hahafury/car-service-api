import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { CurrentUserPayload, RoleEnum, RolesGuard } from '@app/modules';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
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
    getHandler: jest.fn(),
    getClass: jest.fn(),
  };

  let reflector: Reflector;
  let rolesGuard: RolesGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Reflector, RolesGuard],
    }).compile();

    reflector = module.get<Reflector>(Reflector);
    rolesGuard = module.get<RolesGuard>(RolesGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(reflector).toBeDefined();
    expect(rolesGuard).toBeDefined();
  });

  it('should permit access to route', async () => {
    const payload: CurrentUserPayload = { id: 1, role: RoleEnum.MANAGER };
    const getAllAndOverride: jest.SpyInstance = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockResolvedValueOnce([RoleEnum.CLIENT, RoleEnum.MANAGER] as never);

    const getRequest: jest.SpyInstance = jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValueOnce({ user: payload });

    const validateRoles: jest.SpyInstance = jest.spyOn(
      rolesGuard,
      'validateRoles',
    );

    const result: boolean = await rolesGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toEqual(true);
    expect(validateRoles).toBeCalledWith(RoleEnum.MANAGER, [
      RoleEnum.CLIENT,
      RoleEnum.MANAGER,
    ]);
    expect(getRequest).toHaveBeenCalled();
    expect(getAllAndOverride).toHaveBeenCalled();
  });

  it('should throw ForbiddenResource error if roles do not provided', async () => {
    const getAllAndOverride: jest.SpyInstance = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockResolvedValueOnce(undefined as never);

    const getRequest: jest.SpyInstance = jest.spyOn(
      mockExecutionContext.switchToHttp(),
      'getRequest',
    );

    const result: boolean = await rolesGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toEqual(false);
    expect(getAllAndOverride).toHaveBeenCalled();
    expect(getRequest).toBeCalledTimes(0);
  });

  it('should throw ForbiddenResource error if role does not provided', async () => {
    const getAllAndOverride: jest.SpyInstance = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockResolvedValueOnce([RoleEnum.CLIENT] as never);

    const getRequest: jest.SpyInstance = jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValueOnce({ user: undefined });

    const result: boolean = await rolesGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toEqual(false);
    expect(getRequest).toHaveBeenCalled();
    expect(getAllAndOverride).toHaveBeenCalled();
  });

  it('should throw ForbiddenResource error if role does not match', async () => {
    const payload: CurrentUserPayload = { id: 1, role: RoleEnum.MANAGER };
    const getAllAndOverride: jest.SpyInstance = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockResolvedValueOnce([RoleEnum.CLIENT] as never);

    const getRequest: jest.SpyInstance = jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValueOnce({ user: payload });

    const validateRoles: jest.SpyInstance = jest.spyOn(
      rolesGuard,
      'validateRoles',
    );

    const result: boolean = await rolesGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(validateRoles).toBeCalledWith(RoleEnum.MANAGER, [RoleEnum.CLIENT]);
    expect(result).toEqual(false);
    expect(getRequest).toHaveBeenCalled();
    expect(getAllAndOverride).toHaveBeenCalled();
  });
});
