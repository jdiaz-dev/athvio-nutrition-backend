import { Injectable } from '@nestjs/common';
import { ProgramTag } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { CreateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/create-program-tag.dto';
import { ProgramTagsPersistenceService } from 'src/modules/professionals/program-tags/adapters/out/program-tags-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

@Injectable()
export class ProgramTagsManagementService {
  constructor(
    private ptps: ProgramTagsPersistenceService,
    private pms: ProfessionalsManagementService,
  ) {}

  async createProgramTag(dto: CreateProgramTagDto): Promise<ProgramTag> {
    await this.pms.getProfessionalById(dto.professional, { _id: 1 });
    const programTag = await this.ptps.createProgramTag(dto);
    return programTag;
  }
}
