import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { IUserContext } from 'src/shared/interfaces/user-context';
import { ProgramTagsPersistenceService } from '../out/program-tags-persistence.service';
import { ProgramTag } from '../out/program-tag.schema';
import { CreateProgramTagDto } from './dtos/create-program-tag.dto';
import { DeleteProgramTagDto } from './dtos/delete-program-tag.dto';
// import { GetProgramTagsDto } from './dtos/get-program.tag.dto';
import { UpdateProgramTagDto } from './dtos/update-program-tag.dto';

@Resolver()
export class ProgramTagsResolver {
  constructor(private readonly ptps: ProgramTagsPersistenceService) {}

  @Mutation(() => ProgramTag)
  @UseGuards(AuthorizationGuard)
  createProgramTag(@Args('input') ticketDto: CreateProgramTagDto, @Context() context: any): Promise<ProgramTag> {
    return this.ptps.createProgramTag(ticketDto, context.req.user.userId);
  }

  @Query(() => [ProgramTag])
  @UseGuards(AuthorizationGuard)
  async getProgramTags(
    // @Args('input') dto: GetProgramTagsDto,
    @CurrentUser() context: IUserContext,
  ): Promise<ProgramTag[]> {
    const programTag = await this.ptps.getProgramTags(context.userId);
    return programTag;
  }

  @Mutation(() => ProgramTag)
  @UseGuards(AuthorizationGuard)
  async updateProgramTag(
    @Args('input') dto: UpdateProgramTagDto,
    @CurrentUser() context: IUserContext,
  ): Promise<ProgramTag> {
    return this.ptps.updateProgramTag(dto, context.userId);
  }

  @Mutation(() => ProgramTag)
  @UseGuards(AuthorizationGuard)
  deleteProgramTag(@Args('input') dto: DeleteProgramTagDto, @CurrentUser() context: IUserContext): Promise<ProgramTag> {
    return this.ptps.deleteProgramTag(dto, context.userId);
  }
}
