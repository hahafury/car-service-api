import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserRepository } from '@app/modules/user/repositories';
import { UserEntity } from '@app/modules/user/entities';

describe('UserRepository', () => {
  const mockDataSource: Record<string, jest.Mock> = {
    createEntityManager: jest.fn(),
  };

  let dataSource: DataSource;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: DataSource, useValue: mockDataSource },
        UserRepository,
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  it('should call findUserByEmail method and return the user', async () => {
    const user: UserEntity = new UserEntity();
    const email: string = 'test@gmail.com';
    const findOne: jest.SpyInstance = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValueOnce(user);
    const findUserByEmail: jest.SpyInstance = jest.spyOn(
      userRepository,
      'findUserByEmail',
    );

    const result: UserEntity = await userRepository.findUserByEmail(email);

    expect(result).toEqual(user);
    expect(findOne).toHaveBeenCalled();
    expect(findUserByEmail).toHaveBeenCalled();
  });
});
