import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { QuestionaryDetail, QuestionaryGroup } from 'src/shared/schemas/questionary.schema';

export type CreateQuestionary = Pick<QuestionaryConfig, 'professional'> & {
  questionaryGroups: Omit<QuestionaryGroup, '_id'>[];
};

export type AddQuestionaryDetail = {
  questionary: string;
  questionaryGroup: string;
  professional: string;
  questionaryDetailBodies: Omit<QuestionaryDetail, 'isDeleted'>[];
};

type QuestionaryDetailBody = Omit<QuestionaryDetail, '_id' | 'isDeleted'> & { questionaryDetail: string };

export type UpdateQuestionaryDetail = Omit<AddQuestionaryDetail, 'questionaryDetailBodies'> & {
  questionaryDetailBodies: QuestionaryDetailBody[];
};

export type DeleteQuestionaryDetail = Omit<AddQuestionaryDetail, 'questionaryDetailBodies'> & { questionaryDetails: string[] };
