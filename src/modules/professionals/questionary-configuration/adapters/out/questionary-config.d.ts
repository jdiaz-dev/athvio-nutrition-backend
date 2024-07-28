import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { QuestionaryGroup } from 'src/shared/schemas/questionary.schema';

export type CreateQuestionary = Pick<QuestionaryConfig, 'professional'> & {
  questionaryGroups: Omit<QuestionaryGroup, '_id'>[];
};
