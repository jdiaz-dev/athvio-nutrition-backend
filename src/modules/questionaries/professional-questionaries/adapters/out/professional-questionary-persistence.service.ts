import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProfessionalQuestionary, ProfessionalQuestionaryDocument } from './professional-questionary.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { CreateQuestionary } from 'src/modules/questionaries/professional-questionaries/adapters/out/professional-questionary';
import { LayersServer, CustomFieldsGroupName } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { EnableQuestionaryDetailsDto } from 'src/modules/questionaries/professional-questionaries/adapters/in/dtos/enable-questionary-details.dto';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

@Injectable()
export class ProfessionalQuestionaryPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(
    @InjectModel(ProfessionalQuestionary.name) private readonly professionalQuestionary: Model<ProfessionalQuestionaryDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async createQuestionary(questionary: CreateQuestionary): Promise<ProfessionalQuestionary> {
    try {
      const questionaryRes = await this.professionalQuestionary.create({
        ...questionary,
      });
      return questionaryRes;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }

  async enableMultipleQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetails }: EnableQuestionaryDetailsDto,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    try {
      const arrayFilters = questionaryDetails.map((detail, index) => ({
        [`detail${index}._id`]: new Types.ObjectId(detail.questionaryDetail),
        [`detail${index}.isDeleted`]: false,
      }));

      const updateSubDocuments = questionaryDetails.reduce((acc, detail, index) => {
        acc[`questionaryGroups.$[group].questionaryDetails.$[detail${index}].isEnabled`] = detail.isEnabled;
        return acc;
      }, {} as Record<string, boolean>);

      const questionaryRes = await this.professionalQuestionary.findOneAndUpdate(
        { _id: questionary, professional },
        {
          $set: updateSubDocuments,
        },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': { $ne: CustomFieldsGroupName } },
            ...arrayFilters,
          ],
          new: true,
          projection: selectors,
        },
      );

      return questionaryRes;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getProfessionalQuestionary(professional: string, selectors?: Record<string, number>): Promise<ProfessionalQuestionary> {
    const internalUse = selectors ? true : false;
    try {
      const questionaryRes = await this.professionalQuestionary.aggregate([
        {
          $match: { professional: new Types.ObjectId(professional) },
        },
        {
          $project: {
            ...(internalUse && removeAttributesWithFieldNames(selectors, ['questionaryGroups'])),
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
                      cond: {
                        $and: [
                          { $eq: ['$$detail.isDeleted', false] },
                          ...(!internalUse ? [{ $eq: ['$$detail.isEnabled', true] }] : []),
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
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
