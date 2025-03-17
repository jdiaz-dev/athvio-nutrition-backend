import { EnumRoles } from 'src/shared/enums/project';

export interface UserLoged {
  _id: string;
  role: EnumRoles;
  token: string;
}
