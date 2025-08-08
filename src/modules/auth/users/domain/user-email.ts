import { ErrorUserMailEmun } from 'src/modules/auth/users/domain/user-enums';
import { CustomBadRequestException } from 'src/shared/exceptions/custom-bad-reques-exception';

export class UserEmail {
  constructor(public value: string) {
    this.validateEmail();
  }

  private validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new CustomBadRequestException(ErrorUserMailEmun.INVALID_FORMAT);
    }
  }
}
