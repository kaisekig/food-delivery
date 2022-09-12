import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrator } from './entities/administrators.entity';
import { AdministratorService } from './administrators.service';

describe('AdministratorsService', () => {
  let administratorService: AdministratorService;
  let administratorRepository: Repository<Administrator>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdministratorService,
        {
          provide: getRepositoryToken(Administrator),
          useValue: {
            save: jest.fn().mockRejectedValue(Administrator),
            find: jest.fn().mockRejectedValue(Administrator)
          }
        }
      ],
      
    }).compile();

    administratorService    = module.get<AdministratorService>(AdministratorService);
    administratorRepository = module.get<Repository<Administrator>>(getRepositoryToken(Administrator));
  });

  it('should be defined', () => {
    expect(administratorService).toBeDefined();
  });
});
