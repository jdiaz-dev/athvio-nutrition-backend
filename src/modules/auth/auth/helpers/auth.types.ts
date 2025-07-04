import { EnumRoles } from 'src/modules/auth/shared/enums';

export interface UserLoged {
  uuid: string;
  role: EnumRoles;
  token: string;
}
