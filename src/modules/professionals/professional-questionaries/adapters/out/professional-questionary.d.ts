import { Questionary } from 'src/modules/backoffice/questionary/adapters/out/questionary.schema';
import { QuestionaryDetail, QuestionaryGroup } from 'src/shared/schemas/questionary-base.schema';

export type CreateQuestionary = Pick<Questionary, 'uuid' | 'professional'> & {
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
