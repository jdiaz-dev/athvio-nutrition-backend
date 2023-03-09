import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProgramDto } from 'src/modules/users/programs/adapters/in/dtos/create-program.dto';
import { DeleteProgramDto } from 'src/modules/users/programs/adapters/in/dtos/delete-program.dto';
import { GetProgramDto } from 'src/modules/users/programs/adapters/in/dtos/get-program.dto';
import { GetProgramsDto } from 'src/modules/users/programs/adapters/in/dtos/get-programs.dto';
import { AddProgramTagDto } from 'src/modules/users/programs/adapters/in/dtos/update-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/users/programs/adapters/in/dtos/update-program.dto';
import { Program, ProgramDocument } from 'src/modules/users/programs/adapters/out/program.schema';
import { ErrorProgramEnum } from 'src/shared/enums/messages-bad-request';

@Injectable()
export class ProgramsPersistenceService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async createProgram(dto: CreateProgramDto, userId: string): Promise<Program> {
    const program = await this.programModel.create({
      userId,
      ...dto,
    });
    return program;
  }

  async getProgram(dto: GetProgramDto, userId: string, selectors: string[]): Promise<Program> {
    const program = await this.programModel.findOne(
      {
        userId,
        _id: dto._id,
        isDeleted: false,
      },
      selectors,
    );

    console.log('-------program', program);
    return program;
  }
  async getPrograms(dto: GetProgramsDto, userId: string, selectors: string[]): Promise<Program[]> {
    const programs = await this.programModel
      .find(
        {
          userId,
          isDeleted: false,
        },
        selectors,
        {
          limit: dto.limit,
          skip: dto.offset,
          sort: dto.orderBy,
        },
      )
      .populate('tags');
    return programs;
  }
  async updateProgram({ _id, ...rest }: UpdateProgramDto, userId: string): Promise<Program> {
    const program = await this.programModel.findOneAndUpdate(
      { _id, userId, isDeleted: false },
      { ...rest },
      { new: true },
    );

    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    return program;
  }

  async addProgramTag({ _id, ...rest }: AddProgramTagDto, userId: string, selectors: string[]): Promise<Program> {
    //ensuring tags field
    selectors.includes('tags') ? selectors : selectors.push('tags');
    const program = await this.programModel
      .findOneAndUpdate({ _id, userId }, { $push: { tags: rest.programTagId } }, { new: true, projection: selectors })
      .populate('tags');
    return program;
  }

  async deleteProgramTag({ _id, ...rest }: AddProgramTagDto, userId: string, selectors: string[]): Promise<Program> {
    //ensuring tags field
    selectors.includes('tags') ? selectors : selectors.push('tags');
    const program = await this.programModel
      .findOneAndUpdate({ _id, userId }, { $pull: { tags: rest.programTagId } }, { new: true, projection: selectors })
      .populate('tags');

    return program;
  }

  async deleteProgram(dto: DeleteProgramDto, userId: string, selectors: string[]): Promise<Program> {
    const program = await this.programModel
      .findOneAndUpdate(
        {
          _id: dto._id,
          userId,
          isDeleted: false,
        },
        {
          isDeleted: true,
        },
        { new: true },
      )
      .select(selectors)
      .populate('tags');

    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
