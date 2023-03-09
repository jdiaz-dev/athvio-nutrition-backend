import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { CreateClientGroupDto } from 'src/modules/users/client-groups/adapters/in/dtos/create-client-group.dto';
import { DeleteClientGroupDto } from 'src/modules/users/client-groups/adapters/in/dtos/delete-client-group.dto';
import { UpdateClientGroupDto } from 'src/modules/users/client-groups/adapters/in/dtos/update-client-group.dto';
import { ClientGroup } from 'src/modules/users/client-groups/adapters/out/client-group.schema';
import { ClientGroupsPersistenceService } from 'src/modules/users/client-groups/adapters/out/client-groups-persistence.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { IUserContext } from 'src/shared/interfaces/user-context';

@Resolver()
export class ClientGroupsResolver {
  constructor(private readonly cgps: ClientGroupsPersistenceService) {}

  @Mutation(() => ClientGroup)
  @UseGuards(AuthorizationGuard)
  createClientGroup(@Args('input') dto: CreateClientGroupDto, @Context() context: any): Promise<ClientGroup> {
    return this.cgps.createClientGroup(dto, context.req.user.userId);
  }

  @Query(() => [ClientGroup])
  @UseGuards(AuthorizationGuard)
  async getClientGroups(
    @CurrentUser() context: IUserContext,
  ): Promise<ClientGroup[]> {
    const clientGroup = await this.cgps.getClientGroups(context.userId);
    return clientGroup;
  }

  @Mutation(() => ClientGroup)
  @UseGuards(AuthorizationGuard)
  async updateClientGroup(
    @Args('input') dto: UpdateClientGroupDto,
    @CurrentUser() context: IUserContext,
  ): Promise<ClientGroup> {
    return this.cgps.updateClientGroup(dto, context.userId);
  }

  @Mutation(() => ClientGroup)
  @UseGuards(AuthorizationGuard)
  deleteClientGroup(
    @Args('input') dto: DeleteClientGroupDto,
    @CurrentUser() context: IUserContext,
  ): Promise<ClientGroup> {
    return this.cgps.deleteClientGroup(dto, context.userId);
  }
}
