import { Query, Resolver } from '@nestjs/graphql';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Resolver()
export class ProfessionalsResolver {
  constructor(private pps: ProfessionalsPersistenceService) {}
  @Query(() => String)
  sayHello(): string {
    this.pps;
    return 'Hello World!';
  }

  //update organization info

}
