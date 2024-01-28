import { User } from 'src/modules/authentication/users/adapters/out/user.schema';

export interface IValidateUserUseCase {
  validateUser(email: string): Promise<User>;
}
