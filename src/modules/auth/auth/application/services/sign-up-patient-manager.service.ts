import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';
import { SignUpPatientDto, SignUpPatientResponse } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-patient.dto';
import { PatientState } from 'src/shared/enums/project';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ActivatePatientDto } from 'src/modules/auth/auth/adapters/in/web/dtos/activate-user.dto';
import { PatientManagerService } from 'src/modules/patients/patients/application/patient-manager.service';
import { EncryptionService } from 'src/modules/auth/auth/application/services/encryption.service';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { SignUpPatientFromMobileDto } from 'src/modules/auth/auth/adapters/in/mobile/dtos/sign-up-patient-from-mobile.dto';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';
import { PatientOnboardingManagerService } from 'src/modules/onboarding/application/patient-onboarding-manager.service';
import { EnumRoles } from 'src/modules/auth/shared/enums';
import { JwtDto } from 'src/modules/auth/auth/helpers/dtos/jwt.dto';

@Injectable()
export class SignUpPatientManagerService {
  constructor(
    private readonly ums: UserManagamentService,
    private readonly pms: PatientManagerService,
    private as: AuthenticationService,
    private readonly patientOnboardingManagerService: PatientOnboardingManagerService,
  ) {}

  async signUpPatientFromWeb(dto: SignUpPatientDto): Promise<SignUpPatientResponse> {
    return this.patientOnboardingManagerService.onboardingForWeb(dto);
  }
  async signUpPatientFromMobile(dto: SignUpPatientFromMobileDto): Promise<JwtDto> {
    const { uuid, role } = await this.patientOnboardingManagerService.onboardingForMobile(dto);
    return this.as.generateToken({ uuid, role });
  }
  async activatePatient({ user, password }: ActivatePatientDto): Promise<Patient> {
    const { uuid, role, isActive } = await this.ums.getUserByUuid(user);

    if (role !== EnumRoles.PATIENT) throw new BadRequestException(ErrorPatientsEnum.USER_IS_NOT_PATIENT);
    if (isActive) throw new BadRequestException(ErrorPatientsEnum.USER_ALREADY_ACTIVE);

    await this.ums.updateUser({ user: uuid, isActive: true, password: EncryptionService.encrypt(password) });
    const activatedPatient = await this.pms.updatePatientState({ user: uuid, state: PatientState.ACTIVE });
    return activatedPatient;
  }
}
