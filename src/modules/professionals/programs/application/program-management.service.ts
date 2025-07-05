import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { ProgramTagsPersistenceService } from 'src/modules/professionals/program-tags/adapters/out/program-tags-persistence.service';
import { DeleteProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/delete-program.dto';
import { ManageProgramTagDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/manage-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/update-program.dto';

import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { CreateProgram, GetProgram } from 'src/modules/professionals/programs/types/program';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class ProgramManagementService {
  constructor(
    private ptps: ProgramTagsPersistenceService,
    private pps: ProgramsPersistenceService,
    private prps: ProfessionalsPersistenceService,
  ) {}

  async createProgram({ plans, ...rest }: Omit<CreateProgram, 'uuid'>) {
    await this.prps.getProfessionalById(rest.professional, { _id: 1 });
    const program = await this.pps.createProgram({
      uuid: randomUUID(),
      ...rest,
      plans: plans.map(({ meals, ...restPlan }) => ({
        ...restPlan,
        uuid: randomUUID(),
        meals: meals.map((meal) => ({ ...meal, uuid: randomUUID() })),
      })),
    });
    return program;
  }
  async getProgram(dto: GetProgram, selectors?: Record<string, number>): Promise<Program> {
    const program = await this.pps.getProgram(dto, selectors);
    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return program;
  }
  async manageProgramTag(dto: ManageProgramTagDto): Promise<Program> {
    await this.ptps.getProgramTag(dto.professional, dto.programTag);
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
