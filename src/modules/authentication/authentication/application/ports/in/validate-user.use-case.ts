import { User } from 'src/modules/authentication/users/adapters/out/user.schema';

export type UserValidated = Pick<User, '_id' | 'role'>;
export interface IValidateUserUseCase {
  validateCredentials(email: string, password: string): Promise<UserValidated>;
}
