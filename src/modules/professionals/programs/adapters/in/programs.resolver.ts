import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { AssignProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/assign-program.dto';
import { CreateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/create-program.dto';
import { DeleteProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/delete-program.dto';
import { GetProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/get-program.dto';
import {
  GetProgramsDto,
  GetProgramsResponse,
} from 'src/modules/professionals/programs/adapters/in/dtos/program/get-programs.dto';
import { ManageProgramTagDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/manage-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/update-program.dto';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AssignProgramService } from 'src/modules/professionals/programs/application/assign-program.service';
import { ProgramManagerService } from 'src/modules/professionals/programs/application/program-manager.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class ProgramsResolver {
  constructor(
    private readonly pms: ProgramManagerService,
    private readonly aps: AssignProgramService,
  ) {}

  @Mutation(() => Program)
  createProgram(@Args('input') dto: CreateProgramDto): Promise<Program> {
    return this.pms.createProgram(dto);
  }

  @Query(() => Program)
  async getProgram(
    @Args('input') dto: GetProgramDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    const program = await this.pms.getProgram(dto, selectors);
    return program;
  }

  @Query(() => GetProgramsResponse)
  async getPrograms(
    @Args('input') dto: GetProgramsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetProgramsResponse> {
    const program = await this.pms.getPrograms(dto, selectors);
    return program;
  }

  @Mutation(() => Program)
  async updateProgram(@Args('input') dto: UpdateProgramDto): Promise<Program> {
    return this.pms.updateProgram(dto);
  }

  @Mutation(() => Program)
  async manageProgramTag(@Args('input') dto: ManageProgramTagDto): Promise<Program> {
    return this.pms.manageProgramTag(dto);
  }
  @Mutation(() => [PatientPlan])
  async assignProgram(@Args('input') dto: AssignProgramDto): Promise<PatientPlan[]> {
    return this.aps.assignProgramToPatient(dto);
  }
  @Mutation(() => Program)
  deleteProgram(@Args('input') dto: DeleteProgramDto, @Info(...selectorExtractor()) selectors: string[]): Promise<Program> {
    return this.pms.deleteProgram(dto, selectors);
  }
}
