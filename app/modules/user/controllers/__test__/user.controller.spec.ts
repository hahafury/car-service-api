import { UserService } from '@app/modules/user/services';
import { UserController } from '@app/modules/user/controllers';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CurrentUserPayload,
  OnlyAuthorizedGuard,
  RoleEnum,
} from '@app/modules';
import { UserEntity } from '@app/modules/user/entities';
import { CanActivate } from '@nestjs/common';

describe('UserController', () => {
  const onlyAuthorizedGuardMock: CanActivate = {
    canActivate: jest.fn(() => true),
  };

  const userServiceMock: Record<string, jest.Mock> = {
    getUserById: jest.fn(),
  };
  let userService: UserService;
  let userController: UserController;
  let onlyAuthorizedGuard: OnlyAuthorizedGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
      controllers: [UserController],
    })
      .overrideGuard(OnlyAuthorizedGuard)
      .useValue(onlyAuthorizedGuardMock)
      .compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
    onlyAuthorizedGuard = module.get<OnlyAuthorizedGuard>(OnlyAuthorizedGuard);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userController).toBeDefined();
    expect(onlyAuthorizedGuard).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user', async () => {
      const currentUser: CurrentUserPayload = { id: 1, role: RoleEnum.CLIENT };
      const user: UserEntity = new UserEntity();
      user.id = 2;

      const getUserById: jest.SpyInstance = jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValueOnce(user);

      const result: UserEntity = await userController.getMe(currentUser);

      expect(result).toEqual(user);
      expect(getUserById).toHaveBeenCalled();
    });
  });
});
