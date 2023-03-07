import { CreateUserInput } from 'src/modules/users/programs/adapters/out/inputs/create-user.input';

export interface IUserRepository {
  createUser(user: CreateUserInput): any;
  getUser(email: string): any;
  getUserEmail(email: string): any;
}
