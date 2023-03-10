import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/add-client-plan-comment.dto copy';
import { DeleteClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/delete-client-plan-comment.dto';
import { UpdateClientPlanCommentDto } from 'src/modules/clients/client-plans/adapters/in/dtos/client-plan-comment/update-client-plan-comment.dto';
import { ClientPlan, ClientPlanDocument } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ErrorClientPlanEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class ClientPlanCommentPersistenceService {
  constructor(@InjectModel(ClientPlan.name) private readonly clienPlanModel: Model<ClientPlanDocument>) {}

  async addClientPlanComment(
    { clientPlanId, clientId, ...rest }: AddClientPlanCommentDto,
    selectors: string[],
  ): Promise<ClientPlan> {
    const clientPlan = await this.clienPlanModel.findOneAndUpdate(
      { _id: clientPlanId, clientId, isDeleted: false },
      { $push: { comments: { ...rest } } },
      { new: true, projection: selectors },
    );

    if (clientPlan == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return clientPlan;
  }

  async updateClientPlanComment(
    { clientPlanId, clientId, commentId, message }: UpdateClientPlanCommentDto,
    selectors: string[],
  ): Promise<ClientPlan> {
    const clientPlan = await this.clienPlanModel.findOneAndUpdate(
      { _id: clientPlanId, clientId, isDeleted: false },
      { $set: { 'comments.$[el].message': message } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(commentId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );

    if (clientPlan == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return clientPlan;
  }

  async deleteClientPlanComment(
    { clientPlanId, clientId, commentId }: DeleteClientPlanCommentDto,
    selectors: string[],
  ): Promise<ClientPlan> {
    const clientPlan = await this.clienPlanModel.findOneAndUpdate(
      { _id: clientPlanId, clientId, isDeleted: false },
      { $set: { 'comments.$[el].isDeleted': true } },
      {
        arrayFilters: [{ 'el._id': new Types.ObjectId(commentId), 'el.isDeleted': false }],
        new: true,
        projection: selectors,
      },
    );

    if (clientPlan == null) throw new BadRequestException(ErrorClientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return clientPlan;
  }
}
