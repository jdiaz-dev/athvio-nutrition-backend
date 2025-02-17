import { User } from 'src/modules/authentication/users/adapters/out/user.schema';

export type CreateUser = Partial<User>;

export type GetUserById = Pick<User, '_id' | 'firstname' | 'lastname' | 'role' | 'email' | 'isActive'>;

export type UpdateUser = Partial<Pick<User, 'password' | 'isActive'>> & { user: string };
//acceptedTerms

export type UpdatePassword = Pick<User, 'password'> & { user: string };
