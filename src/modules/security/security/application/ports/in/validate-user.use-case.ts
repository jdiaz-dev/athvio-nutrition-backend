import { User } from 'src/modules/security/users/adapters/out/user.schema';

export interface IValidateUserUseCase {
  validateUser(email: string): Promise<User>;
}
