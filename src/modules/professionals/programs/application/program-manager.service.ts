import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { DeleteProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/delete-program.dto';
import { ManageProgramTagDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/manage-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/update-program.dto';

import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { CreateProgram, GetProgram } from 'src/modules/professionals/programs/types/program';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { ProgramTagsManagerService } from 'src/modules/professionals/program-tags/application/program-tags-manager.service';
import {
  GetProgramsDto,
  GetProgramsResponse,
} from 'src/modules/professionals/programs/adapters/in/dtos/program/get-programs.dto';

@Injectable()
export class ProgramManagerService {
  constructor(
    private ptms: ProgramTagsManagerService,
    private pps: ProgramsPersistenceService,
    private pms: ProfessionalsManagementService,
  ) {}

  async createProgram({ plans, professional, ...rest }: Omit<CreateProgram, 'uuid'>) {
    const { _id } = await this.pms.getProfessionalByUuid(professional.toString(), { _id: 1 });
    const program = await this.pps.createProgram({
      uuid: randomUUID(),
      professional: _id,
      ...rest,
      ...(plans && {
        plans: plans.map(({ meals, ...restPlan }) => ({
          ...restPlan,
          uuid: randomUUID(),
          meals: meals.map((meal) => ({ ...meal, uuid: randomUUID() })),
        })),
      }),
    });
    return program;
  }
  async getProgram({ professional, ...restDto }: GetProgram, selectors?: Record<string, number>): Promise<Program> {
    const { _id } = await this.pms.getProfessionalByUuid(professional, { _id: 1 });
    const program = await this.pps.getProgram({ professional: _id.toString(), ...restDto }, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
  async getPrograms({ professional, ...rest }: GetProgramsDto, selectors: Record<string, number>): Promise<GetProgramsResponse> {
    const { _id } = await this.pms.getProfessionalByUuid(professional, { _id: 1 });
    const programs = await this.pps.getPrograms({ professional: _id.toString(), ...rest }, selectors);
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
  async deleteProgram(dto: DeleteProgramDto, selectors: string[]): Promise<Program | null> {
    const program = await this.pps.deleteProgram(dto, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
}
