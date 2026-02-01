import { Injectable } from '@nestjs/common';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import {
  GetProgramsDto,
  GetProgramsResponse,
} from 'src/modules/professionals/programs/adapters/in/dtos/program/get-programs.dto';

@Injectable()
export class MasterProgramsManagerService {
  constructor(private pps: ProgramsPersistenceService) {}

  async getMasterPrograms(
    { professional, ...rest }: GetProgramsDto,
    selectors: Record<string, number>,
  ): Promise<GetProgramsResponse> {
    const programs = await this.pps.getPrograms({ professional, isRecommendedByMaster: true, ...rest }, selectors);
    return programs;
  }
}
