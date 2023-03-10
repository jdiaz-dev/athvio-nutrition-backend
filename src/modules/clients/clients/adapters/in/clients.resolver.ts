import { UseGuards } from '@nestjs/common';
import { Args, Context, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateClientDto } from 'src/modules/clients/clients/adapters/in/dtos/create-client.dto';
import { GetClientsDto } from 'src/modules/clients/clients/adapters/in/dtos/get-clients.dto';
import { UpdateClientDto } from 'src/modules/clients/clients/adapters/in/dtos/update-client.dto';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';
import { ClientsPersistenceService } from 'src/modules/clients/clients/adapters/out/clients-persistence.service';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { IUserContext } from 'src/shared/interfaces/user-context';
import { ManageClientStateDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-state.dto';
import { ManageClientGroupDto } from 'src/modules/clients/clients/adapters/in/dtos/manage-client-group.dto';
import { ManageClientGroupService } from 'src/modules/clients/clients/application/manage-client-group.service';

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly cps: ClientsPersistenceService, private mcgs: ManageClientGroupService) {}

  @Mutation(() => Client)
  @UseGuards(AuthorizationGuard)
  createClient(@Args('input') dto: CreateClientDto, @Context() context: any): Promise<Client> {
    return this.cps.createClient(dto, context.req.user.userId);
  }

  @Query(() => [Client])
  @UseGuards(AuthorizationGuard)
  async getClients(
    @Args('input') dto: GetClientsDto,
    @CurrentUser() context: IUserContext,

    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Client[]> {
    const clientGroup = await this.cps.getClients(dto, context.userId, selectors);
    return clientGroup;
  }

  @Mutation(() => Client)
  @UseGuards(AuthorizationGuard)
  async updateClient(
    @Args('input') dto: UpdateClientDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Client> {
    return this.cps.updateClient(dto, context.userId, selectors);
  }

  @Mutation(() => Client)
  @UseGuards(AuthorizationGuard)
  manageClientGroup(@Args('input') dto: ManageClientGroupDto, @CurrentUser() context: IUserContext): Promise<Client> {
    return this.mcgs.manageClientGroup(dto, context.userId);
  }

  @Mutation(() => Client)
  @UseGuards(AuthorizationGuard)
  manageClientState(
    @Args('input') dto: ManageClientStateDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Client> {
    return this.cps.manageClientState(dto, context.userId, selectors);
  }
}
