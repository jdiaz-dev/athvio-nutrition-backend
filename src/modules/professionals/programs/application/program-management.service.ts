import { Injectable } from '@nestjs/common';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { ProgramTagsPersistenceService } from 'src/modules/professionals/program-tags/adapters/out/program-tags-persistence.service';
import { CreateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/create-program.dto';
import { ManageProgramTagDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/manage-program-tag.dto';

import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';

@Injectable()
export class ProgramManagementService {
  constructor(
    private ptps: ProgramTagsPersistenceService,
    private pps: ProgramsPersistenceService,
    private prps: ProfessionalsPersistenceService,
  ) {}

  async createProgram(dto: CreateProgramDto) {
    await this.prps.getProfessionalById(dto.professionalId);
    const program = await this.pps.createProgram(dto);
    return program;
  }
  async manageProgramTag(dto: ManageProgramTagDto): Promise<Program> {
    await this.ptps.getProgramTag(dto.professionalId, dto.programTagId);
    return this.pps.updateProgramTag(dto);
  }
}
