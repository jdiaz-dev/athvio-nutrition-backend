import { Test, TestingModule } from '@nestjs/testing';
import { ClientGroupsPersistenceService } from './client-groups-persistence.service';

describe('ClientGroupsPersistenceService', () => {
  let service: ClientGroupsPersistenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientGroupsPersistenceService],
    }).compile();

    service = module.get<ClientGroupsPersistenceService>(ClientGroupsPersistenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
