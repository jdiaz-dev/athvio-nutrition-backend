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

  async createProgramTag({ professional, ...rest }: CreateProgramTagDto): Promise<ProgramTag> {
    const programTag = await this.programTagModel.create({
      professional,
      ...rest,
    });
    return programTag;
  }
  async getProgramTag(professional: string, programTag: string): Promise<ProgramTag> {
    const programTagRes = await this.programTagModel.findOne({
      professional,
      _id: programTag,
      isDeleted: false,
    });
    if (!programTagRes) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTagRes;
  }
  async getProgramTags({ professional }: GetProgramTagsDto): Promise<ProgramTag[]> {
    const programTags = await this.programTagModel.find({
      professional,
      isDeleted: false,
    });
    return programTags;
  }
  async updateProgramTag({ professional, programTag, ...rest }: UpdateProgramTagDto): Promise<ProgramTag> {
    const programTagRes = await this.programTagModel.findOneAndUpdate(
      { _id: programTag, professional, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (programTagRes == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTagRes;
  }

  async deleteProgramTag(dto: DeleteProgramTagDto, professional: string): Promise<ProgramTag> {
    const programTagRes = await this.programTagModel.findOneAndUpdate({
      _id: dto.programTag,
      professional,
      isDeleted: true,
    });

    if (programTagRes == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);

    return programTagRes;
  }
}
