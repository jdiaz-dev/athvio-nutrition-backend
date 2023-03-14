import { Test, TestingModule } from '@nestjs/testing';
import { ProgramTagsPersistenceService } from './program-tags-persistence.service';

describe('ProgramTagsPersistenceService', () => {
  let service: ProgramTagsPersistenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramTagsPersistenceService],
    }).compile();

    service = module.get<ProgramTagsPersistenceService>(ProgramTagsPersistenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
