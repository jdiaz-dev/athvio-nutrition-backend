import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateClientDto, CreateClientResponse } from 'src/modules/clients/clients/adapters/in/dtos/create-client.dto';
import { GetClientsDto } from 'src/modules/clients/clients/adapters/in/dtos/get-clients.dto';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/functions';
import { ManageClientStateDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-state.dto';
import { ManageClientGroupDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-group.dto';
import { ManageClientGroupService } from 'src/modules/clients/clients/application/manage-client-group.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { ClientManagementService } from 'src/modules/clients/clients/application/client-management.service';

@Resolver(() => Client)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class ClientsResolver {
  constructor(
    private readonly cps: ClientsPersistenceService,
    private mcgs: ManageClientGroupService,
    private cms: ClientManagementService,
  ) {}

  @Mutation(() => CreateClientResponse)
  //AuthorizationProfessionalGuard
  createClient(@Args('input') dto: CreateClientDto): Promise<CreateClientResponse> {
    return this.cms.createClient(dto);
  }

  @Query(() => [Client])
  async getClients(
    @Args('input') dto: GetClientsDto,
    @Info(...selectorExtractorForAggregation()) selectors: string[],
  ): Promise<Client[]> {
    const clientGroup = await this.cps.getClients(dto, selectors);
    return clientGroup;
  }

  /* @Mutation(() => Client)
  @UseGuards(AuthorizationGuard)
  async updateClient(
    @Args('input') dto: UpdateClientDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Client> {
    return this.cps.updateClient(dto, context.professionalId, selectors);
  } */

  @Mutation(() => Client)
  manageClientGroup(@Args('input') dto: ManageClientGroupDto): Promise<Client> {
    return this.mcgs.manageClientGroup(dto);
  }

  @Mutation(() => Client)
  manageClientState(
    @Args('input') dto: ManageClientStateDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Client> {
    return this.cps.manageClientState(dto, selectors);
  }
}
