import { Injectable } from '@nestjs/common';
import { ProgramTag } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { CreateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/create-program-tag.dto';
import { ProgramTagsPersistenceService } from 'src/modules/professionals/program-tags/adapters/out/program-tags-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class ProgramTagsManagementService {
  constructor(private ptps: ProgramTagsPersistenceService, private pps: ProfessionalsPersistenceService) {}

  async createProgramTag(dto: CreateProgramTagDto): Promise<ProgramTag> {
    await this.pps.getProfessionalById(dto.professionalId);
    const programTag = await this.ptps.createProgramTag(dto);
    return programTag;
  }
}
