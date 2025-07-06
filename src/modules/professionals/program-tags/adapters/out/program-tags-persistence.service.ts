import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { ErrorProgramTagEnum } from 'src/shared/enums/messages-response';
import { ProgramTag, ProgramTagDocument } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { CreateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/create-program-tag.dto';
import { UpdateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/update-program-tag.dto';
import { DeleteProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/delete-program-tag.dto';
import { GetProgramTagsDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/get-program-tags.dto';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ProgramTagsPersistenceService extends MongodbQueryBuilder<ProgramTagDocument> {
  constructor(
    @InjectModel(ProgramTag.name) protected readonly programTagModel: Model<ProgramTagDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(programTagModel, logger, ProgramTag.name);
  }

  async createProgramTag({ professional, ...rest }: CreateProgramTagDto): Promise<ProgramTag> {
    const programTag = await this.initializeQuery(this.createProgramTag.name).create({
      uuid: randomUUID(),
      professional,
      ...rest,
    });
    return programTag;
  }
  async getProgramTag(professional: string, programTag: string): Promise<ProgramTag> {
    const programTagRes = await this.initializeQuery(this.getProgramTag.name).findOne({
      professional,
      _id: programTag,
      isDeleted: false,
    });
    if (!programTagRes) throw new BadRequestException(ErrorProgramTagEnum.PROGRAM_TAG_NOT_FOUND);
    return programTagRes;
  }
  async getProgramTags({ professional }: GetProgramTagsDto): Promise<ProgramTag[]> {
    const programTags = await this.initializeQuery(this.getProgramTags.name).find({
      professional,
      isDeleted: false,
    });
    return programTags;
  }
  async updateProgramTag({ professional, programTag, ...rest }: UpdateProgramTagDto): Promise<ProgramTag> {
    const programTagRes = await this.initializeQuery(this.updateProgramTag.name).findOneAndUpdate(
      { uuid: programTag, professional, isDeleted: false },
      { ...rest },
      { new: true },
    );

    return programTagRes;
  }

  async deleteProgramTag(dto: DeleteProgramTagDto): Promise<ProgramTag> {
    const programTagRes = await this.initializeQuery(this.deleteProgramTag.name).findOneAndUpdate(
      {
        uuid: dto.programTag,
        professional: new Types.ObjectId(dto.professional),
        isDeleted: false,
      },
      { isDeleted: true },
    );

    return programTagRes;
  }
}
