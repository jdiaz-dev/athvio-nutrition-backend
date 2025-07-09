import {
  PatientQuestionaryDetail,
  PatientQuestionaryDocument,
  PatientQuestionaryGroup,
} from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary.schema';

export type CreatePatientQuestionary = Pick<PatientQuestionaryDocument, 'uuid' | 'patient' | 'professional'> & {
  questionaryGroups: Omit<PatientQuestionaryGroup, '_id'>[];
};

type QuestionaryDetailBody = Omit<PatientQuestionaryDetail, '_id' | 'isDeleted'> & { questionaryDetail: string };

export type UpdateQuestionaryDetail = Omit<AddQuestionaryDetail, 'questionaryDetailBodies'> & {
  questionaryDetailBodies: QuestionaryDetailBody[];
};
