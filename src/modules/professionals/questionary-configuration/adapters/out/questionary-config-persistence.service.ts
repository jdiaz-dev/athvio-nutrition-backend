import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QuestionaryConfig, QuestionaryConfigDocument } from './questionary-config.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import {
  AddQuestionaryDetail,
  CreateQuestionary,
  DeleteQuestionaryDetail,
  UpdateQuestionaryDetail,
} from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config';
import { LayersServer } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { EnableQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/enable-questionary-detail.dto';

const OtherFieldsGroupName = 'Otros'; //to allow the professional create his own custom questions
@Injectable()
export class QuestionaryConfigPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(@InjectModel(QuestionaryConfig.name) private readonly questionaryConfig: Model<QuestionaryConfigDocument>) {
    this.questionaryConfig;
  }
  async createQuestionary(questionary: CreateQuestionary): Promise<QuestionaryConfig> {
    try {
      const questionaryRes = await this.questionaryConfig.create({
        ...questionary,
      });
      return questionaryRes;
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async enableQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetail, enabled }: EnableQuestionaryDetailDto,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    try {
      const questionaryRes = await this.questionaryConfig.findOneAndUpdate(
        { _id: questionary, professional },
        {
          $set: {
            'questionaryGroups.$[group].questionaryDetails.$[detail].enabled': enabled,
          },
        },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': { $ne: OtherFieldsGroupName } },
            { 'detail._id': new Types.ObjectId(questionaryDetail), 'detail.isDeleted': false },
          ],
          new: true,
          projection: selectors,
        },
      );

      return questionaryRes;
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async addQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetailBody }: AddQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    try {
      const questionaryRes = await this.questionaryConfig.findOneAndUpdate(
        { _id: questionary, professional },
        { $push: { 'questionaryGroups.$[questionaryGroup].questionaryDetails': { ...questionaryDetailBody } } },
        {
          arrayFilters: [
            { 'questionaryGroup._id': new Types.ObjectId(questionaryGroup), 'questionaryGroup.title': OtherFieldsGroupName },
          ],
          new: true,
          projection: {
            ...restFields,
            questionaryGroups: {
              $map: {
                input: '$questionaryGroups',
                as: 'group',
                in: {
                  _id: '$$group._id',
                  title: '$$group.title',
                  questionaryDetails: {
                    $filter: {
                      input: '$$group.questionaryDetails',
                      as: 'detail',
                      cond: { $eq: ['$$detail.isDeleted', false] },
                    },
                  },
                },
              },
            },
          },
        },
      );

      return questionaryRes;
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async updateQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetail, questionaryDetailBody }: UpdateQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    try {
      const questionaryRes = await this.questionaryConfig.findOneAndUpdate(
        { _id: questionary, professional },
        {
          $set: {
            'questionaryGroups.$[group].questionaryDetails.$[detail].fieldName': questionaryDetailBody.fieldName,
            'questionaryGroups.$[group].questionaryDetails.$[detail].associatedQuestion':
              questionaryDetailBody.associatedQuestion,
            'questionaryGroups.$[group].questionaryDetails.$[detail].enabled': questionaryDetailBody.enabled,
            'questionaryGroups.$[group].questionaryDetails.$[detail].fieldType': questionaryDetailBody.fieldType,
          },
        },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': OtherFieldsGroupName },
            { 'detail._id': new Types.ObjectId(questionaryDetail), 'detail.isDeleted': false },
          ],
          new: true,
          projection: {
            ...restFields,
            questionaryGroups: {
              $map: {
                input: '$questionaryGroups',
                as: 'group',
                in: {
                  _id: '$$group._id',
                  title: '$$group.title',
                  questionaryDetails: {
                    $filter: {
                      input: '$$group.questionaryDetails',
                      as: 'detail',
                      cond: { $eq: ['$$detail.isDeleted', false] },
                    },
                  },
                },
              },
            },
          },
        },
      );

      return questionaryRes;
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async deleteQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetail }: DeleteQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);

    try {
      const questionaryRes = await this.questionaryConfig.findOneAndUpdate(
        { _id: questionary, professional },
        {
          $set: {
            'questionaryGroups.$[group].questionaryDetails.$[detail].isDeleted': true,
          },
        },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': OtherFieldsGroupName },
            { 'detail._id': new Types.ObjectId(questionaryDetail), 'detail.isDeleted': false },
          ],
          new: true,
          projection: {
            ...restFields,
            questionaryGroups: {
              $map: {
                input: '$questionaryGroups',
                as: 'group',
                in: {
                  _id: '$$group._id',
                  title: '$$group.title',
                  questionaryDetails: {
                    $filter: {
                      input: '$$group.questionaryDetails',
                      as: 'detail',
                      cond: { $eq: ['$$detail.isDeleted', false] },
                    },
                  },
                },
              },
            },
          },
        },
      );

      return questionaryRes;
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getQuestionaryConfig(professional: string, selectors: Record<string, number>): Promise<QuestionaryConfig> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    try {
      const questionaryRes = await this.questionaryConfig.aggregate([
        {
          $match: { professional: new Types.ObjectId(professional) },
        },
        {
          $project: {
            ...restFields,
            questionaryGroups: {
              $map: {
                input: '$questionaryGroups',
                as: 'group',
                in: {
                  _id: '$$group._id',
                  title: '$$group.title',
                  questionaryDetails: {
                    $filter: {
                      input: '$$group.questionaryDetails',
                      as: 'detail',
                      cond: { $eq: ['$$detail.isDeleted', false] },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            ...selectors,
          },
        },
      ]);
      return questionaryRes[0];
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
