import { User } from 'src/modules/auth/users/adapters/out/user.schema';

export type GetUserById = Pick<User, '_id' | 'uuid' | 'firstname' | 'lastname' | 'role' | 'email' | 'isActive'>;

export type UpdateUser = Partial<Pick<User, 'password' | 'isActive'>> & { user: string };
//acceptedTerms

export type UpdatePassword = Pick<User, 'password'> & { user: string };
