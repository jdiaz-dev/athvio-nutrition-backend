import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/create-client-group.dto';
import { DeleteClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/delete-client-group.dto';
import { GetClientGroupsDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/get-client-groups.dto';
import { UpdateClientGroupDto } from 'src/modules/professionals/client-groups/adapters/in/dtos/update-client-group.dto';
import { ClientGroup } from 'src/modules/professionals/client-groups/adapters/out/client-group.schema';
import { ClientGroupsPersistenceService } from 'src/modules/professionals/client-groups/adapters/out/client-groups-persistence.service';
import { ClientGroupsManagementService } from 'src/modules/professionals/client-groups/application/client-groups-management.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class ClientGroupsResolver {
  constructor(private readonly cgps: ClientGroupsPersistenceService, private cgms: ClientGroupsManagementService) {}

  @Mutation(() => ClientGroup)
  @UseGuards(AuthorizationGuard)
  createClientGroup(@Args('input') dto: CreateClientGroupDto): Promise<ClientGroup> {
    return this.cgms.createClientGroup(dto);
  }

  @Query(() => [ClientGroup])
  @UseGuards(AuthorizationGuard)
  async getClientGroups(@Args('input') dto: GetClientGroupsDto): Promise<ClientGroup[]> {
    const clientGroup = await this.cgps.getClientGroups(dto);
    return clientGroup;
  }

  @Mutation(() => ClientGroup)
  @UseGuards(AuthorizationGuard)
  async updateClientGroup(@Args('input') dto: UpdateClientGroupDto): Promise<ClientGroup> {
    return this.cgps.updateClientGroup(dto);
  }

  @Mutation(() => ClientGroup)
  @UseGuards(AuthorizationGuard)
  deleteClientGroup(@Args('input') dto: DeleteClientGroupDto): Promise<ClientGroup> {
    return this.cgms.deleteClientGroup(dto);
  }
}
