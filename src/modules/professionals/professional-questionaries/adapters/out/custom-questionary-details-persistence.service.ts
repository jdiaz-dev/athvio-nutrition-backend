import { Injectable } from '@nestjs/common';
import { ProfessionalQuestionary, ProfessionalQuestionaryDocument } from './professional-questionary.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  AddQuestionaryDetail,
  DeleteQuestionaryDetail,
  UpdateQuestionaryDetail,
} from 'src/modules/professionals/professional-questionaries/adapters/out/professional-questionary';
import { CustomFieldsGroupName } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/adapters/out/database/mongodb-query-builder';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Trazability } from 'src/shared/types';

@Injectable()
export class CustomQuestionaryDetailsPersistenceService extends MongodbQueryBuilder<ProfessionalQuestionaryDocument> {
  constructor(
    @InjectModel(ProfessionalQuestionary.name) protected readonly professionalQuestionary: Model<ProfessionalQuestionaryDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(professionalQuestionary, logger, ProfessionalQuestionary.name, als);
  }
  async addQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetailBodies }: AddQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);

    const questionaryRes = await this.initializeQuery(this.addQuestionaryDetail.name).findOneAndUpdate(
      { uuid: questionary, professional },
      {
        $push: {
          'questionaryGroups.$[questionaryGroup].questionaryDetails': {
            $each: questionaryDetailBodies,
          },
        },
      },
      {
        arrayFilters: [{ 'questionaryGroup.uuid': questionaryGroup, 'questionaryGroup.title': CustomFieldsGroupName }],
        new: true,
        projection: {
          ...restFields,
          questionaryGroups: {
            $map: {
              input: '$questionaryGroups',
              as: 'group',
              in: {
                _id: '$$group._id',
                uuid: '$$group.uuid',
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
  }
  async updateQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetailBodies }: UpdateQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    const updateSubDocuments = questionaryDetailBodies.map((body, index) => ({
      [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].fieldName`]: body.fieldName,
      [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].associatedQuestion`]: body.associatedQuestion,
      [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].isEnabled`]: body.isEnabled,
      [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].fieldType`]: body.fieldType,
    }));

    const arrayFilters = questionaryDetailBodies.map((body, index) => ({
      [`detail${index}.uuid`]: body.questionaryDetail,
      [`detail${index}.isDeleted`]: false,
    }));

    const questionaryRes = await this.initializeQuery(this.updateQuestionaryDetail.name).findOneAndUpdate(
      { uuid: questionary, professional },
      { $set: Object.assign({}, ...updateSubDocuments) },
      {
        arrayFilters: [{ 'group.uuid': questionaryGroup, 'group.title': CustomFieldsGroupName }, ...arrayFilters],
        new: true,
        projection: {
          ...restFields,
          questionaryGroups: {
            $map: {
              input: '$questionaryGroups',
              as: 'group',
              in: {
                _id: '$$group._id',
                uuid: '$$group.uuid',
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
  }
  async deleteQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetails }: DeleteQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);

    const deleteSubDocuments = questionaryDetails.map((_item, index) => ({
      [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].isDeleted`]: true,
    }));
    const arrayFilters = questionaryDetails.map((item, index) => ({
      [`detail${index}.uuid`]: item,
      [`detail${index}.isDeleted`]: false,
    }));
    const questionaryRes = await this.initializeQuery(this.deleteQuestionaryDetail.name).findOneAndUpdate(
      { uuid: questionary, professional },
      {
        $set: Object.assign({}, ...deleteSubDocuments),
      },
      {
        arrayFilters: [{ 'group.uuid': questionaryGroup, 'group.title': CustomFieldsGroupName }, ...arrayFilters],
        new: true,
        projection: {
          ...restFields,
          questionaryGroups: {
            $map: {
              input: '$questionaryGroups',
              as: 'group',
              in: {
                _id: '$$group._id',
                uuid: '$$group.uuid',
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
  }
}
