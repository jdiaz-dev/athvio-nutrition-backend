import { Test, TestingModule } from '@nestjs/testing';
import { CustomMealsPersistenceService } from './custom-meals-persistence.service';

describe('CustomMealsPersistenceService', () => {
  let service: CustomMealsPersistenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomMealsPersistenceService],
    }).compile();

    service = module.get<CustomMealsPersistenceService>(
      CustomMealsPersistenceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
