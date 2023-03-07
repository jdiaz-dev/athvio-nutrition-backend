import { Test, TestingModule } from '@nestjs/testing';
import { SecurityResolver } from './security.resolver';

describe('SecurityResolver', () => {
  let resolver: SecurityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityResolver],
    }).compile();

    resolver = module.get<SecurityResolver>(SecurityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
