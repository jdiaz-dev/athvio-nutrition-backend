import {
  PatientQuestionary,
  PatientQuestionaryGroup,
} from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary.schema';

export type CreatePatientQuestionary = Pick<PatientQuestionary, 'patient'> & {
  questionaryGroups: Omit<PatientQuestionaryGroup, '_id'>[];
};


type QuestionaryDetailBody = Omit<QuestionaryDetail, '_id' | 'isDeleted'> & { questionaryDetail: string };

export type UpdateQuestionaryDetail = Omit<AddQuestionaryDetail, 'questionaryDetailBodies'> & {
  questionaryDetailBodies: QuestionaryDetailBody[];
};
