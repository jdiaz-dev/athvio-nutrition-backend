import { Test, TestingModule } from '@nestjs/testing';
import { CustomMealsResolver } from './custom-meals.resolver';

describe('CustomMealsResolver', () => {
  let resolver: CustomMealsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomMealsResolver],
    }).compile();

    resolver = module.get<CustomMealsResolver>(CustomMealsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
