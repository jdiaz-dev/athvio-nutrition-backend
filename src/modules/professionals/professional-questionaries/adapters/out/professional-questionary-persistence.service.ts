import { Injectable } from '@nestjs/common';
import { ProfessionalQuestionary, ProfessionalQuestionaryDocument } from './professional-questionary.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateQuestionary } from 'src/modules/professionals/professional-questionaries/adapters/out/professional-questionary';
import { CustomFieldsGroupName } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { EnableQuestionaryDetailsDto } from 'src/modules/professionals/professional-questionaries/adapters/in/dtos/enable-questionary-details.dto';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class ProfessionalInternalQuestionaryPersistenceService extends MongodbQueryBuilder<ProfessionalQuestionaryDocument> {
  constructor(
    @InjectModel(ProfessionalQuestionary.name)
    protected readonly professionalQuestionaryModel: Model<ProfessionalQuestionaryDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(professionalQuestionaryModel, logger, ProfessionalQuestionary.name);
  }

  async createQuestionary(questionary: CreateQuestionary): Promise<ProfessionalQuestionary> {
    const questionaryRes = await this.initializeQuery(this.createQuestionary.name).create({
      ...questionary,
    });
    return questionaryRes;
  }

  async enableMultipleQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetails }: EnableQuestionaryDetailsDto,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    const arrayFilters = questionaryDetails.map((detail, index) => ({
      [`detail${index}.uuid`]: detail.questionaryDetail,
      [`detail${index}.isDeleted`]: false,
    }));

    const updateSubDocuments = questionaryDetails.reduce(
      (acc, detail, index) => {
        acc[`questionaryGroups.$[group].questionaryDetails.$[detail${index}].isEnabled`] = detail.isEnabled;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    const questionaryRes = await this.initializeQuery(this.enableMultipleQuestionaryDetail.name).findOneAndUpdate(
      { uuid: questionary, professional },
      {
        $set: updateSubDocuments,
      },
      {
        arrayFilters: [{ 'group.uuid': questionaryGroup, 'group.title': { $ne: CustomFieldsGroupName } }, ...arrayFilters],
        new: true,
        projection: selectors,
      },
    );

    return questionaryRes;
  }
  async getProfessionalQuestionary(professional: string, selectors?: Record<string, number>): Promise<ProfessionalQuestionary> {
    const isFromExternalRequest = selectors ? true : false;
    const questionaryRes = await this.initializeQuery(this.getProfessionalQuestionary.name).aggregate([
      {
        $match: { professional },
      },
      {
        $project: {
          ...(isFromExternalRequest && removeAttributesWithFieldNames(selectors, ['questionaryGroups'])),
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
                    cond: {
                      $and: [
                        { $eq: ['$$detail.isDeleted', false] },
                        ...(!isFromExternalRequest ? [{ $eq: ['$$detail.isEnabled', true] }] : []),
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);
    return questionaryRes[0];
  }
}
