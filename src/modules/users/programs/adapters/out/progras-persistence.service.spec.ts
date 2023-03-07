import { Test, TestingModule } from '@nestjs/testing';
import { PrograsPersistenceService } from './progras-persistence.service';

describe('PrograsPersistenceService', () => {
  let service: PrograsPersistenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrograsPersistenceService],
    }).compile();

    service = module.get<PrograsPersistenceService>(PrograsPersistenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
