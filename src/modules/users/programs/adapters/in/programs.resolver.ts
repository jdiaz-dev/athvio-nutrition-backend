import { UseGuards } from '@nestjs/common';
import { Args, Context, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { CreateProgramDto } from 'src/modules/users/programs/adapters/in/dtos/create-program.dto';
import { DeleteProgramDto } from 'src/modules/users/programs/adapters/in/dtos/delete-program.dto';
import { GetProgramDto } from 'src/modules/users/programs/adapters/in/dtos/get-program.dto';
import { GetProgramsDto } from 'src/modules/users/programs/adapters/in/dtos/get-programs.dto';
import { AddProgramTagDto } from 'src/modules/users/programs/adapters/in/dtos/update-program-tag.dto';
import { UpdateProgramDto } from 'src/modules/users/programs/adapters/in/dtos/update-program.dto';
import { Program } from 'src/modules/users/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/users/programs/adapters/out/programs-persistence.service';
import { ManageProgramTagService } from 'src/modules/users/programs/application/manage-program-tag.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { IUserContext } from 'src/shared/interfaces/user-context';

@Resolver()
export class ProgramsResolver {
  constructor(private readonly pps: ProgramsPersistenceService, private mpts: ManageProgramTagService) {}

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  createProgram(@Args('input') dto: CreateProgramDto, @Context() context: any): Promise<Program> {
    return this.pps.createProgram(dto, context.req.user.userId);
  }

  @Query(() => Program)
  @UseGuards(AuthorizationGuard)
  async getProgram(
    @Args('input') dto: GetProgramDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    const program = await this.pps.getProgram(dto, context.userId, selectors);
    return program;
  }

  @Query(() => [Program])
  @UseGuards(AuthorizationGuard)
  async getPrograms(
    @Args('input') dto: GetProgramsDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program[]> {
    const program = await this.pps.getPrograms(dto, context.userId, selectors);
    return program;
  }

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async updateProgram(@Args('input') dto: UpdateProgramDto, @CurrentUser() context: IUserContext): Promise<Program> {
    return this.pps.updateProgram(dto, context.userId);
  }

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async addProgramTag(
    @Args('input') dto: AddProgramTagDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mpts.manageProgramTag(dto, context.userId, selectors);
  }
  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  deleteProgram(
    @Args('input') dto: DeleteProgramDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.deleteProgram(dto, context.userId, selectors);
  }
}
