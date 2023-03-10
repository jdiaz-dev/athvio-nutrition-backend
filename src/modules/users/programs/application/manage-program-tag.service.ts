import { Injectable } from '@nestjs/common';
import { ProgramTagsPersistenceService } from 'src/modules/users/program-tags/adapters/out/program-tags-persistence.service';
import { ManageProgramTagDto } from 'src/modules/users/programs/adapters/in/dtos/program/manage-program-tag.dto';

import { Program } from 'src/modules/users/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/users/programs/adapters/out/programs-persistence.service';

@Injectable()
export class ManageProgramTagService {
  constructor(private ptps: ProgramTagsPersistenceService, private pps: ProgramsPersistenceService) {}

  async manageProgramTag(dto: ManageProgramTagDto, userId: string): Promise<Program> {
    await this.ptps.getProgramTag(userId, dto.programTagId);
    return this.pps.updateProgramTag(dto, userId);
  }
}
