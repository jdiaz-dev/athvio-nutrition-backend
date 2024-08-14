import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QuestionaryConfig, QuestionaryConfigDocument } from './questionary-config.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { CreateQuestionary } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config';
import { LayersServer, OtherFieldsGroupName } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { EnableQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/enable-questionary-details.dto';

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

  async enableMultipleQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetails }: EnableQuestionaryDetailsDto,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    try {
      const arrayFilters = questionaryDetails.map((detail, index) => ({
        [`detail${index}._id`]: new Types.ObjectId(detail.questionaryDetail),
        [`detail${index}.isDeleted`]: false,
      }));

      const updateSubDocuments = questionaryDetails.reduce((acc, detail, index) => {
        acc[`questionaryGroups.$[group].questionaryDetails.$[detail${index}].isEnabled`] = detail.isEnabled;
        return acc;
      }, {} as Record<string, boolean>);

      const questionaryRes = await this.questionaryConfig.findOneAndUpdate(
        { _id: questionary, professional },
        {
          $set: updateSubDocuments,
        },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': { $ne: OtherFieldsGroupName } },
            ...arrayFilters,
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
