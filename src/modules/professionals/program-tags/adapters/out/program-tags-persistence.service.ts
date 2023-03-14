import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { ErrorProgramTagEnum } from 'src/shared/enums/messages-response';
import { ProgramTag, ProgramTagDocument } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { CreateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/create-program-tag.dto';
import { UpdateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/update-program-tag.dto';
import { DeleteProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/delete-program-tag.dto';
import { GetProgramTagsDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/get-program-tags.dto';

@Injectable()
export class ProgramTagsPersistenceService {
  constructor(@InjectModel(ProgramTag.name) private readonly programTagModel: Model<ProgramTagDocument>) {}

  async createProgramTag({ professionalId, ...rest }: CreateProgramTagDto): Promise<ProgramTag> {
    const programTag = await this.programTagModel.create({
      professionalId,
      ...rest,
    });
    return programTag;
  }
  async getProgramTag(professionalId: string, programTagId: string): Promise<ProgramTag> {
    const programTag = await this.programTagModel.findOne({
      professionalId,
      _id: programTagId,
      isDeleted: false,
    });
    if (!programTag) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTag;
  }
  async getProgramTags({ professionalId }: GetProgramTagsDto): Promise<ProgramTag[]> {
    const programTags = await this.programTagModel.find({
      professionalId,
      isDeleted: false,
    });
    return programTags;
  }
  async updateProgramTag({ professionalId, programTagId, ...rest }: UpdateProgramTagDto): Promise<ProgramTag> {
    const programTag = await this.programTagModel.findOneAndUpdate(
      { _id: programTagId, professionalId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (programTag == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTag;
  }

  async deleteProgramTag(dto: DeleteProgramTagDto, professionalId: string): Promise<ProgramTag> {
    const programTag = await this.programTagModel.findOneAndUpdate({
      _id: dto.programTagId,
      professionalId,
      isDeleted: true,
    });

    if (programTag == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);

    return programTag;
  }
}
