import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/create-program-tag.dto';
import { DeleteProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/delete-program-tag.dto';
import { GetProgramTagsDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/get-program-tags.dto';
import { UpdateProgramTagDto } from 'src/modules/professionals/program-tags/adapters/in/dtos/update-program-tag.dto';
import { ProgramTag } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { ProgramTagsManagementService } from 'src/modules/professionals/program-tags/application/program-tags-persistence.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { IUserContext } from 'src/shared/interfaces/user-context';
import { ProgramTagsPersistenceService } from '../out/program-tags-persistence.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class ProgramTagsResolver {
  constructor(private ptms: ProgramTagsManagementService, private readonly ptps: ProgramTagsPersistenceService) {}

  @Mutation(() => ProgramTag)
  createProgramTag(@Args('input') dto: CreateProgramTagDto): Promise<ProgramTag> {
    return this.ptms.createProgramTag(dto);
  }

  @Query(() => [ProgramTag])
  async getProgramTags(@Args('input') dto: GetProgramTagsDto): Promise<ProgramTag[]> {
    const programTag = await this.ptps.getProgramTags(dto);
    return programTag;
  }

  @Mutation(() => ProgramTag)
  async updateProgramTag(@Args('input') dto: UpdateProgramTagDto): Promise<ProgramTag> {
    return this.ptps.updateProgramTag(dto);
  }

  @Mutation(() => ProgramTag)
  deleteProgramTag(@Args('input') dto: DeleteProgramTagDto, @CurrentUser() context: IUserContext): Promise<ProgramTag> {
    return this.ptps.deleteProgramTag(dto, context.professionalId);
  }
}
