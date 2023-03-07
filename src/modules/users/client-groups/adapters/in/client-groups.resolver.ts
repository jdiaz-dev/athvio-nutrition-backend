import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { IUserContext } from 'src/shared/interfaces/user-context';
import { ClientGroup } from '../out/client-group.schema';
import { ClientGroupsPersistenceService } from '../out/client-groups-persistence.service';
import { CreateClientGroupDto } from './dtos/create-client-group.dto';
import { DeleteClientGroupDto } from './dtos/delete-client-group.dto';
import { UpdateClientGroupDto } from './dtos/update-client-group.dto';

@Resolver()
export class ClientGroupsResolver {
  constructor(private readonly cgps: ClientGroupsPersistenceService) {}

  @Mutation(() => ClientGroup)
  @UseGuards(AuthorizationGuard)
  createClientGroup(@Args('input') ticketDto: CreateClientGroupDto, @Context() context: any): Promise<ClientGroup> {
    return this.cgps.createClientGroup(ticketDto, context.req.user.userId);
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
