import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserTokensRepository } from '@app/modules/user/repositories';

describe('UserRoleRepository', () => {
  const mockDataSource: Record<string, jest.Mock> = {
    createEntityManager: jest.fn(),
  };

  let dataSource: DataSource;
  let userTokensRepository: UserTokensRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: DataSource, useValue: mockDataSource },
        UserTokensRepository,
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    userTokensRepository =
      module.get<UserTokensRepository>(UserTokensRepository);
  });

  it('should be defined', () => {
    expect(userTokensRepository).toBeDefined();
    expect(dataSource).toBeDefined();
  });
});
