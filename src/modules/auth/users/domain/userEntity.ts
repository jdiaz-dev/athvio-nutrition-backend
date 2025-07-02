import { EnumRoles } from 'src/modules/auth/shared/enums';

export class UserEntity {
  constructor(
    public email: string,
    public role: EnumRoles,
    public isActive: boolean,
    public firstname?: string,
    public lastname?: string,
    public password?: string,
    public countryCode?: string,
    public country?: string,
    public acceptedTerms?: boolean,
    public photo?: string,
    public phone?: string,
    public _id?: string,
  ) {}
}
