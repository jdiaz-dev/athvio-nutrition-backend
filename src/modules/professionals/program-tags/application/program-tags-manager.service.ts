import { Injectable } from '@nestjs/common';
import { ProgramTag } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { CreateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/create-program-tag.dto';
import { ProgramTagsPersistenceService } from 'src/modules/professionals/program-tags/adapters/out/program-tags-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { GetProgramTagsDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/get-program-tags.dto';
import { UpdateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/update-program-tag.dto';
import { DeleteProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/delete-program-tag.dto';

@Injectable()
export class ProgramTagsManagerService {
  constructor(
    private ptps: ProgramTagsPersistenceService,
    private pms: ProfessionalsManagementService,
  ) {}

  async createProgramTag({ professional, ...restDto }: CreateProgramTagDto): Promise<ProgramTag> {
    const { _id } = await this.pms.getProfessionalByUuid(professional, { _id: 1 });
    const programTag = await this.ptps.createProgramTag({ professional: _id.toString(), ...restDto });
    return programTag;
  }
  async getProgramTags({ professional }: GetProgramTagsDto): Promise<ProgramTag[]> {
    const { _id } = await this.pms.getProfessionalByUuid(professional, { _id: 1 });
    const programTag = await this.ptps.getProgramTags({ professional: _id.toString() });
    return programTag;
  }
  async updateProgramTag({ professional, ...restDto }: UpdateProgramTagDto): Promise<ProgramTag> {
    const { _id } = await this.pms.getProfessionalByUuid(professional, { _id: 1 });
    const programTag = await this.ptps.updateProgramTag({ professional: _id.toString(), ...restDto });
    return programTag;
  }
  async deleteProgramTag({ ...restDto }: DeleteProgramTagDto, professional: string): Promise<ProgramTag> {
    console.log('------professional', professional)
    const { _id } = await this.pms.getProfessionalByUuid(professional, { _id: 1 });
    const programTag = await this.ptps.deleteProgramTag({ professional: _id.toString(), ...restDto }, _id.toString());
    return programTag;
  }
}
