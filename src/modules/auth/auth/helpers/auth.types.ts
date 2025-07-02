import { EnumRoles } from 'src/modules/auth/shared/enums';

export interface UserLoged {
  _id: string;
  role: EnumRoles;
  token: string;
}
