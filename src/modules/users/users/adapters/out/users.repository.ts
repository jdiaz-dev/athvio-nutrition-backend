import { CreateUserDto } from "src/modules/users/users/adapters/in/dtos/create-user.dto";

export interface IUserRepository {
  createUser(user: CreateUserDto): any;
  getUserByEmail(email: string): any;
}
