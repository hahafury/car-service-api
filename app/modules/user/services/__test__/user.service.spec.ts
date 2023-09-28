import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { UserEntity } from '@app/modules/user/entities';
import { DataSource, Repository } from 'typeorm';
import { UserRepository } from '@app/modules/user/repositories';

describe('UserService', () => {
  const userRepositoryMock: Record<string, jest.Mock> = {
    findOne: jest.fn(),
  };
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: userRepositoryMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUserById', () => {
    it('should get user by ID', async () => {
      const user: UserEntity = new UserEntity();
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      expect(await userService.getUserById(1)).toEqual(user);
    });

    it('should return null when user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const result: UserEntity | null = await userService.getUserById(1);

      expect(result).toBeNull();
    });
  });
});
