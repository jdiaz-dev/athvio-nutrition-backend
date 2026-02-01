import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { DeleteProgramDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/program/delete-program.dto';
import { ManageProgramTagDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/program/manage-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/program/update-program.dto';

import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { CreateProgram, GetProgram } from 'src/modules/professionals/programs/types/program';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { ProgramTagsManagerService } from 'src/modules/professionals/program-tags/application/program-tags-manager.service';
import {
  GetProgramsDto,
  GetProgramsResponse,
} from 'src/modules/professionals/programs/adapters/in/web/dtos/program/get-programs.dto';
import { DuplicateProgramDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/program/duplicate-program.dto';
import { CreateProgramDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/program/create-program.dto';
import { MealImageSources } from 'src/shared/enums/project';

@Injectable()
export class ProgramManagerService {
  constructor(
    private ptms: ProgramTagsManagerService,
    private pps: ProgramsPersistenceService,
    private pms: ProfessionalsManagementService,
  ) {}

  async createProgram({ professional, ...rest }: CreateProgramDto) {
    const { uuid } = await this.pms.getProfessionalByUuid(professional.toString(), { _id: 1, uuid: 1 });
    const program = await this.pps.createProgram({
      uuid: randomUUID(),
      professional: uuid,
      ...rest,
    });
    return program;
  }
  async createProgramForOnboarding({ plans, professional, ...rest }: Omit<CreateProgram, 'uuid'>) {
    const { uuid } = await this.pms.getProfessionalByUuid(professional.toString(), { _id: 1, uuid: 1 });
    const program = await this.pps.createProgram({
      uuid: randomUUID(),
      professional: uuid,
      ...rest,
      ...(plans && {
        plans: plans.map(({ meals, ...restPlan }) => ({
          ...restPlan,
          uuid: randomUUID(),
          meals: meals.map(({ image, ...restMeal }) => ({
            ...restMeal,
            ...(image && { image, imageSource: MealImageSources.PROGRAM }),
            uuid: randomUUID(),
          })),
        })),
      }),
    });
    return program;
  }
  async getProgram(dto: GetProgram, selectors?: Record<string, number>): Promise<Program> {
    const program = await this.pps.getProgram(dto, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
  async getPrograms({ professional, ...rest }: GetProgramsDto, selectors: Record<string, number>): Promise<GetProgramsResponse> {
    const programs = await this.pps.getPrograms({ professional, ...rest }, selectors);
    return programs;
  }
  async manageProgramTag(dto: ManageProgramTagDto): Promise<Program> {
    await this.ptms.getProgramTag(dto.professional, dto.programTag);
    const program = await this.pps.updateProgramTag(dto);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
  async updateProgram(dto: UpdateProgramDto): Promise<Program> {
    const program = await this.pps.updateProgram(dto);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    return program;
  }
  async duplicateProgram(dto: DuplicateProgramDto): Promise<Program> {
    const program = await this.pps.getProgram(dto, { plans: 1, name: 1, description: 1 });
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    const { name, description, plans } = program;

    const duplicatedProgram = await this.pps.createProgram({
      uuid: randomUUID(),
      professional: dto.professional,
      name: `${name} (duplicado)`,
      description,
      plans: plans.map(({ meals, ...restPlan }) => ({
        ...restPlan,
        uuid: randomUUID(),
        meals: meals.map(({ image, ...restMeal }) => ({
          ...restMeal,
          ...(image && { image, imageSource: MealImageSources.PROGRAM }),
          uuid: randomUUID(),
        })),
      })),
    });

    return duplicatedProgram;
  }
  async deleteProgram(dto: DeleteProgramDto, selectors: string[]): Promise<Program | null> {
    const program = await this.pps.deleteProgram(dto, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
