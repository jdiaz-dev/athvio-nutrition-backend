import { User } from 'src/modules/auth/users/adapters/out/user.schema';

export type UserValidated = Pick<User, 'uuid' | 'role'>;
export interface IValidateUserUseCase {
  validateCredentials(email: string, password: string): Promise<UserValidated>;
}
