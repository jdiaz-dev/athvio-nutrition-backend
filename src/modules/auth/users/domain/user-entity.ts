import { EnumRoles } from 'src/modules/auth/shared/enums';
import { UserEmail } from 'src/modules/auth/users/domain/user-email';
import { CustomBadRequestException } from 'src/shared/exceptions/custom-bad-reques-exception';

export class UserEntity {
  constructor(
    public email: UserEmail,
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
  validateUserCreationForProfessional() {
    if (!this.email || !this.firstname || !this.lastname || !this.password) {
      throw new CustomBadRequestException(ErrorUserEntityEnum.USER_FOR_PROFESSIONAL);
    }
  }
  validateUserCreationForWebPatient() {
    if (!this.email || !this.firstname || !this.lastname) {
      throw new CustomBadRequestException(ErrorUserEntityEnum.USER_FOR_WEB_PATIENT);
    }
  }
  validateUserForMobilePatient() {
    if (!this.email || !this.password) {
      throw new CustomBadRequestException(ErrorUserEntityEnum.USER_FOR_MOBILE_PATIENT);
    }
  }
}
