import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsPersistenceService } from './programs-persistence.service';

describe('ProgramsPersistenceService', () => {
  let service: ProgramsPersistenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramsPersistenceService],
    }).compile();

    service = module.get<ProgramsPersistenceService>(ProgramsPersistenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
