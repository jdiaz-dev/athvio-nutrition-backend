import { User } from 'src/modules/authentication/users/adapters/out/user.schema';

export type CreateUser = Partial<User>;
//todo: remove it if work the previous
/* export type CreateUser = Omit<User, '_id' | 'isDarkMode' | 'createdAt' | 'updatedAt'> & {
  timezone?: string;
  countryCode?: string;
  country?: string;
  password?: string;
  professional?: string | null;
  patient?: string | null;
  isProfessional?: boolean;
  isActive?: boolean;
}; */



export type UpdateUser = Partial<Pick<User, 'password' | 'isActive'>> & { user: string };
//acceptedTerms

export type UpdatePassword = Pick<User, 'password'> & { user: string };
