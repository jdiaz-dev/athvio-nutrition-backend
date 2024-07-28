import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { QuestionaryDetail, QuestionaryGroup } from 'src/shared/schemas/questionary.schema';

export type CreateQuestionary = Pick<QuestionaryConfig, 'professional'> & {
  questionaryGroups: Omit<QuestionaryGroup, '_id'>[];
};

export type AddQuestionaryDetail = {
  questionary: string;
  questionaryGroup: string;
  professional: string;
  questionaryDetailBody: Omit<QuestionaryDetail, 'isDeleted'>;
};

export type UpdateQuestionaryDetail = AddQuestionaryDetail & {
  questionaryDetail: string;
};

export type DeleteQuestionaryDetail = Omit<UpdateQuestionaryDetail, 'questionaryDetailBody'>;
