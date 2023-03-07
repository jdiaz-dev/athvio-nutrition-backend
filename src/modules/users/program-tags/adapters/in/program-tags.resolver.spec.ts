import { Test, TestingModule } from '@nestjs/testing';
import { ProgramTagsResolver } from './program-tags.resolver';

describe('ProgramTagsResolver', () => {
  let resolver: ProgramTagsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramTagsResolver],
    }).compile();

    resolver = module.get<ProgramTagsResolver>(ProgramTagsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
