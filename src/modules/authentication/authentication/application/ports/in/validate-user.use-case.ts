import { User } from 'src/modules/authentication/users/adapters/out/user.schema';

export type UserValidated = Pick<User, '_id' | 'isProfessional' | 'professional' | 'patient'>;
export interface IValidateUserUseCase {
  validateCredentials(email: string, password: string): Promise<UserValidated>;
}
