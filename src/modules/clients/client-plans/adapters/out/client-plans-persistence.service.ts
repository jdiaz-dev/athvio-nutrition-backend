import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/create-client-plan.dto';
import { DeleteClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/delete-client-plan.dto';
import { GetClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/get-client-plan.dto';
import { GetClientPlansDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/get-client-plans.dto';
import { UpdateClientPlanDto } from 'src/modules/clients/client-plans/adapters/in/dtos/plan/update-client-plan.dto';
import { ClientPlan, ClientPlanDocument } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlanPartial, ClientWithAssignedDate } from 'src/modules/clients/client-plans/adapters/out/client-plan.type';
import { ErrorClientPlanEnum } from 'src/shared/enums/messages-response';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';

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
    const clientPlans = await this.clienPlanModel.insertMany(dto);
    return clientPlans;
  }
  async getClientPlan({ client, clientPlan }: GetClientPlanDto, selectors: Record<string, number>): Promise<ClientPlan> {
    const restFields = removeAttributesWithFieldNames(selectors, ['meals']);
    client;
    const clientPlanRes = await this.clienPlanModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(clientPlan),
          client: client,
          isDeleted: false,
        },
      },
      {
        $project: {
          ...restFields,
          meals: {
            $filter: {
              input: '$meals', as: 'meal', cond: {
                $and: [
                  { $eq: ['$$meal.isDeleted', false] },
                  // plan ? { $eq: ['$$plan._id', new Types.ObjectId(plan)] } : {}
                ]
              }
            }
          },
        },
      },
    ]);
    if (clientPlanRes[0] == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return clientPlanRes[0] as ClientPlan;
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
  async getManyClientPlans(clientWithAssignedDate: ClientWithAssignedDate[], selectors: Record<string, number>): Promise<ClientPlan[]> {
    const clientPlans = await this.clienPlanModel.find(
      {
        $or: clientWithAssignedDate
      },
      selectors,
    );
    return clientPlans;
  }
  async updateClientPlan(
    { clientPlan, client, ...rest }: UpdateClientPlanDto,
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
