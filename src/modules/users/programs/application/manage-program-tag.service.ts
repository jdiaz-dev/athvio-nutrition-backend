import { Injectable } from '@nestjs/common';
import { ProgramTagsPersistenceService } from 'src/modules/users/program-tags/adapters/out/program-tags-persistence.service';

import { AddProgramTagDto } from 'src/modules/users/programs/adapters/in/dtos/update-program-tag.dto';
import { Program } from 'src/modules/users/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/users/programs/adapters/out/programs-persistence.service';
import { ManageProgramTags } from 'src/shared/enums/project';

@Injectable()
export class ManageProgramTagService {
  constructor(private ptps: ProgramTagsPersistenceService, private pps: ProgramsPersistenceService) {}

  async manageProgramTag(dto: AddProgramTagDto, userId: string, selectors: string[]): Promise<Program> {
    await this.ptps.getProgramTag(userId, dto.programTagId);

    if (dto.action === ManageProgramTags.ADD) {
      return this.pps.addProgramTag(dto, userId, selectors);
    } else {
      return this.pps.deleteProgramTag(dto, userId, selectors);
    }
  }
}
