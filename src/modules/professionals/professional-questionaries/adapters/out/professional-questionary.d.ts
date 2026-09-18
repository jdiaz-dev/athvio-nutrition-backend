import {
  QuestionaryBase,
  QuestionaryDetailBase,
  QuestionaryGroupBase,
} from 'src/shared/adapters/database/schemas/questionary-base.schema';

export type CreateQuestionary = Pick<QuestionaryBase, 'uuid' | 'professional'> & {
  questionaryGroups: Omit<QuestionaryGroupBase, '_id'>[];
};

export type AddQuestionaryDetail = {
  questionary: string;
  questionaryGroup: string;
  professional: string;
  questionaryDetailBodies: Omit<QuestionaryDetailBase, 'isDeleted'>[];
};

type QuestionaryDetailBody = Omit<QuestionaryDetailBase, '_id' | 'uuid' | 'isDeleted'> & {
  questionaryDetail: string;
  fieldType?: string;
};

export type UpdateQuestionaryDetail = Omit<AddQuestionaryDetail, 'questionaryDetailBodies'> & {
  questionaryDetailBodies: QuestionaryDetailBody[];
};

export type DeleteQuestionaryDetail = Omit<AddQuestionaryDetail, 'questionaryDetailBodies'> & { questionaryDetails: string[] };
