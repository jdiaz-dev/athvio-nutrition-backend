import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/create-program.dto';
import { DeleteProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/delete-program.dto';
import { GetProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/get-program.dto';
import { GetProgramsDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/get-programs.dto';
import { ManageProgramTagDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/manage-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/update-program.dto';
import { Program, ProgramDocument } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { ManageProgramTags } from 'src/shared/enums/project';

@Injectable()
export class ProgramsPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async createProgram({ professionalId, ...rest }: CreateProgramDto): Promise<Program> {
    const program = await this.programModel.create({
      professionalId,
      ...rest,
    });
    return program;
  }

  async getProgram({ professionalId, ...rest }: GetProgramDto, selectors: string[]): Promise<Program> {
    const program = await this.programModel.findOne(
      {
        professionalId,
        _id: rest.programId,
        isDeleted: false,
      },
      selectors,
    );

    // console.log('-------program', program);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    return program;
  }
  async getPrograms({ professionalId, ...rest }: GetProgramsDto, selectors: string[]): Promise<Program[]> {
    const programs = await this.programModel
      .find(
        {
          professionalId,
          isDeleted: false,
        },
        selectors,
        {
          limit: rest.limit,
          skip: rest.offset,
          sort: rest.orderBy,
        },
      )
      .populate('tags');
    return programs;
  }
  async updateProgram({ professionalId, programId, ...rest }: UpdateProgramDto): Promise<Program> {
    const program = await this.programModel.findOneAndUpdate(
      { _id: programId, professionalId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    return program;
  }

  async updateProgramTag({ professionalId, programId, action, ...rest }: ManageProgramTagDto): Promise<Program> {
    const _action =
      action === ManageProgramTags.ADD
        ? { $push: { tags: rest.programTagId } }
        : { $pull: { tags: rest.programTagId } };
    const program = await this.programModel.findOneAndUpdate({ _id: programId, professionalId }, _action, {
      new: true,
      populate: 'tags',
    });
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }

  async deleteProgram({ professionalId, ...rest }: DeleteProgramDto, selectors: string[]): Promise<Program> {
    selectors
    const program = await this.programModel
      .findOneAndUpdate(
        {
          _id: rest.programId,
          professionalId,
          isDeleted: false,
        },
        {
          isDeleted: true,
        },
        { new: true },
      )
      .populate('tags');

    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
