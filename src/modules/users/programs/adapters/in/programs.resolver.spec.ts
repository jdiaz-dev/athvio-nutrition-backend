import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsResolver } from './programs.resolver';

describe('ProgramsResolver', () => {
  let resolver: ProgramsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramsResolver],
    }).compile();

    resolver = module.get<ProgramsResolver>(ProgramsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
