import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { ErrorProgramTagEnum } from 'src/shared/enums/messages-response';
import { ProgramTag, ProgramTagDocument } from 'src/modules/users/program-tags/adapters/out/program-tag.schema';
import { CreateProgramTagDto } from 'src/modules/users/program-tags/adapters/in/dtos/create-program-tag.dto';
import { UpdateProgramTagDto } from 'src/modules/users/program-tags/adapters/in/dtos/update-program-tag.dto';
import { DeleteProgramTagDto } from 'src/modules/users/program-tags/adapters/in/dtos/delete-program-tag.dto';

@Injectable()
export class ProgramTagsPersistenceService {
  constructor(@InjectModel(ProgramTag.name) private readonly programTagModel: Model<ProgramTagDocument>) {}

  async createProgramTag(dto: CreateProgramTagDto, userId: string): Promise<ProgramTag> {
    const programTag = await this.programTagModel.create({
      userId,
      ...dto,
    });
    return programTag;
  }
  async getProgramTag(userId: string, programTagId: string): Promise<ProgramTag> {
    const programTag = await this.programTagModel.findOne({
      userId,
      _id: programTagId,
      isDeleted: false,
    });
    if (!programTag) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTag;
  }
  async getProgramTags(userId: string): Promise<ProgramTag[]> {
    const programTags = await this.programTagModel.find({
      userId,
      isDeleted: false,
    });
    return programTags;
  }
  async updateProgramTag({ programTagId, ...rest }: UpdateProgramTagDto, userId: string): Promise<ProgramTag> {
    const programTag = await this.programTagModel.findOneAndUpdate(
      { _id: programTagId, userId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (programTag == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTag;
  }

  async deleteProgramTag(dto: DeleteProgramTagDto, userId: string): Promise<ProgramTag> {
    const programTag = await this.programTagModel.findOneAndUpdate({
      _id: dto.programTagId,
      userId,
      isDeleted: true,
    });

    if (programTag == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);

    return programTag;
  }
}
