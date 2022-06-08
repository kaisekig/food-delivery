import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { AdministratorsController } from './administrators.controller';
import { Administrator } from './administrators.entity';
import { AdministratorService } from './administrators.service';
import { CreateAdministratorDto } from './dtos/create.administrator.dto';
import { UpdateAdministratorDto } from './dtos/update.administrator.dto';
import { ValidateAdministratorDto } from './dtos/validate.administrator.dto';

describe('AdministratorsController', () => {
  let administratorController: AdministratorsController;
  let administratorService: AdministratorService;
  let administratorRepository: Repository<Administrator>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministratorsController],
      providers: [
        AdministratorService,
        {
          provide: getRepositoryToken(Administrator),
          useValue: {
            save: jest.fn().mockRejectedValue(Administrator),
            find: jest.fn().mockRejectedValue(Administrator)
          }
        }
      ]
    }).compile();

    administratorController = module.get<AdministratorsController>(AdministratorsController);
    administratorService    = module.get<AdministratorService>(AdministratorService)
    administratorRepository = module.get<Repository<Administrator>>(getRepositoryToken(Administrator));
  });

  it('should be defined', () => {
    expect(administratorController).toBeDefined();
  });

  
  
});
