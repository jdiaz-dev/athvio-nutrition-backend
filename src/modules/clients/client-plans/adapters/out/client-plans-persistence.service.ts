import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/create-client-plan.dto';
import { DeleteClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/delete-client-plan.dto';
import { GetClientPlansDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/get-client-plans.dto';
import { UpdateClientPlanDateDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/update-client-plan-date.dto';
import { UpdateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/update-client-plan.dto';
import { ClientPlan, ClientPlanDocument } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlanPartial } from 'src/modules/clients/client-plans/adapters/out/client-plan.type';
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
  async createManyClientPlan(dto: ClientPlanPartial[]): Promise<ClientPlan[]> {
    const clientPlan = await this.clienPlanModel.insertMany(dto);
    return clientPlan;
  }
  async getClientPlans({ client, ...rest }: GetClientPlansDto, selectors: string[]): Promise<ClientPlan[]> {
    const clientPlans = await this.clienPlanModel.find(
      {
        client,
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
    { clientPlan, client, ...rest }: UpdateClientPlanDto | UpdateClientPlanDateDto,
    selectors: string[],
  ): Promise<ClientPlan> {
    const clientPlanRes = await this.clienPlanModel.findOneAndUpdate(
      { _id: clientPlan, client, isDeleted: false },
      { ...rest },
      { new: true, projection: selectors },
    );

    if (clientPlanRes == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return clientPlanRes;
  }

  async deleteClientPlan({ clientPlan, client }: DeleteClientPlanDto, selectors: string[]): Promise<ClientPlan> {
    const clientPlanRes = await this.clienPlanModel.findOneAndUpdate(
      {
        _id: clientPlan,
        client,
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
    if (clientPlanRes == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return clientPlanRes;
  }
}
