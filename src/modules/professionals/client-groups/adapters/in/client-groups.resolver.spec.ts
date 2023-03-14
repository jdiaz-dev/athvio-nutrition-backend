import { Test, TestingModule } from '@nestjs/testing';
import { ClientGroupsResolver } from './client-groups.resolver';

describe('ClientGroupsResolver', () => {
  let resolver: ClientGroupsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientGroupsResolver],
    }).compile();

    resolver = module.get<ClientGroupsResolver>(ClientGroupsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
