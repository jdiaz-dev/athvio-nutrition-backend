import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetProfessionalDto } from 'src/modules/professionals/professionals/adapters/in/dtos/get-professional.dt';
import { Professional } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

//TODO : delete it, think how to udpate professional
@Resolver()
export class ProfessionalsResolver {
  constructor(private pms: ProfessionalsManagementService) {}

  @Query(() => Professional)
  getProfessional(@Args('professional') dto: GetProfessionalDto): Promise<Professional> {
    return this.pms.getProfessional(dto);
  }

  //update organization info
}
