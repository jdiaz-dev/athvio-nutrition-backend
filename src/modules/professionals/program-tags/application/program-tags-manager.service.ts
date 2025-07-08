import { BadRequestException, Injectable } from '@nestjs/common';
import { ProgramTag } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { CreateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/create-program-tag.dto';
import { ProgramTagsPersistenceService } from 'src/modules/professionals/program-tags/adapters/out/program-tags-persistence.service';
import { GetProgramTagsDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/get-program-tags.dto';
import { UpdateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/update-program-tag.dto';
import { DeleteProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/delete-program-tag.dto';
import { ErrorProgramTagEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class ProgramTagsManagerService {
  constructor(private ptps: ProgramTagsPersistenceService) {}

  async createProgramTag(dto: CreateProgramTagDto): Promise<ProgramTag> {
    const programTag = await this.ptps.createProgramTag(dto);
    return programTag;
  }
  async getProgramTag(professional: string, programTag: string): Promise<ProgramTag> {
    const programTagRes = await this.ptps.getProgramTag(professional, programTag);
    if (programTagRes == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTagRes;
  }
  async getProgramTags({ professional }: GetProgramTagsDto): Promise<ProgramTag[]> {
    const programTag = await this.ptps.getProgramTags({ professional });
    return programTag;
  }
  async updateProgramTag(dto: UpdateProgramTagDto): Promise<ProgramTag> {
    const programTag = await this.ptps.updateProgramTag(dto);
    if (programTag == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTag;
  }
  async deleteProgramTag(dto: DeleteProgramTagDto): Promise<ProgramTag> {
    const programTag = await this.ptps.deleteProgramTag(dto);
    if (programTag == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTag;
  }
}
