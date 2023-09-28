import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserRoleRepository } from '@app/modules/user/repositories';

describe('UserRoleRepository', () => {
  const mockDataSource: Record<string, jest.Mock> = {
    createEntityManager: jest.fn(),
  };

  let dataSource: DataSource;
  let userRoleRepository: UserRoleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: DataSource, useValue: mockDataSource },
        UserRoleRepository,
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    userRoleRepository = module.get<UserRoleRepository>(UserRoleRepository);
  });

  it('should be defined', () => {
    expect(userRoleRepository).toBeDefined();
    expect(dataSource).toBeDefined();
  });
});
