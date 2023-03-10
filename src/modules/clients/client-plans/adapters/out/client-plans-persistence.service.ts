import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/create-client-plan.dto';
import { DeleteClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/delete-client-plan.dto';
import { GetClientPlansDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/get-client-plans.dto';
import { UpdateClientPlanDateDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/update-client-plan-date.dto';
import { UpdateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan/update-client-plan.dto';
import { ClientPlan, ClientPlanDocument } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ErrorClientPlanEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class ClientPlansPersistenceService {
  constructor(@InjectModel(ClientPlan.name) private readonly clienPlanModel: Model<ClientPlanDocument>) {}

  async createClientPlan(dto: CreateClientPlanDto): Promise<ClientPlan> {
    const clientPlan = await this.clienPlanModel.create({
      ...dto,
    });
    return clientPlan;
  }
  async getClientPlans({ clientId, ...rest }: GetClientPlansDto, selectors: string[]): Promise<ClientPlan[]> {
    const clientPlans = await this.clienPlanModel.find(
      {
        clientId,
        isDeleted: false,
      },
      selectors,
      {
        limit: rest.limit,
        skip: rest.offset,
        sort: rest.orderBy,
      },
    );
    return clientPlans;
  }
  async updateClientPlan(
    { clientPlanId, clientId, ...rest }: UpdateClientPlanDto | UpdateClientPlanDateDto,
    selectors: string[],
  ): Promise<ClientPlan> {
    const clientPlan = await this.clienPlanModel.findOneAndUpdate(
      { _id: clientPlanId, clientId, isDeleted: false },
      { ...rest },
      { new: true, projection: selectors },
    );

    if (clientPlan == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return clientPlan;
  }

  async deleteClientPlan({ clientPlanId, clientId }: DeleteClientPlanDto, selectors: string[]): Promise<ClientPlan> {
    const clientPlan = await this.clienPlanModel.findOneAndUpdate(
      {
        _id: clientPlanId,
        clientId,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
        projection: selectors,
      },
    );
    if (clientPlan == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return clientPlan;
  }
}
