import { UserType } from 'src/shared/enums/project';

export interface UserLoged {
  _id: string;
  userType: UserType;
  token: string;
}
