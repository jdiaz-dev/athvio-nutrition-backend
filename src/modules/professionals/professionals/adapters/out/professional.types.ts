import { User } from 'src/modules/authentication/users/adapters/out/user.schema';
import { Professional } from 'src/modules/professionals/professionals/adapters/out/professional.schema';

export interface CreateProfessional {
  user: string;
  company: string;
  isTrialPeriod: boolean;
}

export type ProfessionalUser = Pick<Professional, '_id'> & { user: User };
