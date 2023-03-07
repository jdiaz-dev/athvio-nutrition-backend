import { CreateProgramTagDto } from '../in/dtos/create-program-tag.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProgramTag, ProgramTagDocument } from './program-tag.schema';
import { Model } from 'mongoose';
import { UpdateProgramTagDto } from '../in/dtos/update-program-tag.dto';
import { BadRequestException } from '@nestjs/common';
import { ErrorProgramTagEnum } from 'src/shared/enums/messages-bad-request';
import { DeleteProgramTagDto } from '../in/dtos/delete-program-tag.dto';

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
  async getProgramTags(userId: string): Promise<ProgramTag[]> {
    const programTags = await this.programTagModel.find({
      userId,
      isDeleted: false,
    });
    return programTags;
  }
  async updateProgramTag({ _id, ...rest }: UpdateProgramTagDto, userId: string): Promise<ProgramTag> {
    const programTag = await this.programTagModel.findOneAndUpdate(
      { _id, userId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (programTag == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTag;
  }

  async deleteProgramTag(dto: DeleteProgramTagDto, userId: string): Promise<ProgramTag> {
    const programTag = await this.programTagModel.findOneAndUpdate({
      _id: dto._id,
      userId,
      isDeleted: true,
    });

    if (programTag == null) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);

    return programTag;
  }
}
