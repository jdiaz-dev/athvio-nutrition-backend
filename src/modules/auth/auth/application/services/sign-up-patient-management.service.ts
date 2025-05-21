import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';
import { SignUpPatientDto, SignUpPatientResponse } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-patient.dto';
import { EnumRoles, LayersServer, PatientState } from 'src/shared/enums/project';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { ActivatePatientDto } from 'src/modules/auth/auth/adapters/in/web/dtos/activate-user.dto';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { EncryptionService } from 'src/modules/auth/auth/application/services/encryption.service';
import { UserManagamentService } from 'src/modules/auth/users/application/user-management.service';
import { SignUpPatientFromMobileDto } from 'src/modules/auth/auth/adapters/in/mobile/dtos/sign-up-patient-from-mobile.dto';
import { UserLoged } from 'src/modules/auth/auth/helpers/auth.types';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';
import { PatientOnboardingManagerService } from 'src/modules/auth/onboarding/application/patient-onboarding-manager.service';

@Injectable()
export class SignUpPatientManagamentService {
  private layer = LayersServer.APPLICATION;
  constructor(
    private readonly ums: UserManagamentService,
    private readonly pms: PatientManagementService,
    private as: AuthenticationService,
    private readonly patientOnboardingManagerService: PatientOnboardingManagerService,
  ) {}

  async signUpPatientFromWeb(dto: SignUpPatientDto): Promise<SignUpPatientResponse> {
    return this.patientOnboardingManagerService.onboardingForWeb(dto);
  }
  async signUpPatientFromMobile(dto: SignUpPatientFromMobileDto): Promise<UserLoged> {
    const { user: _id, role } = await this.patientOnboardingManagerService.onboardingForMobile(dto);
    return this.as.generateToken({ _id, role });
  }
  async activatePatient({ user, password }: ActivatePatientDto): Promise<Patient> {
    const { _id, role, isActive } = await this.ums.getUserById(user);

    if (role !== EnumRoles.PATIENT) throw new BadRequestException(ErrorPatientsEnum.USER_IS_NOT_PATIENT, this.layer);
    if (isActive) throw new BadRequestException(ErrorPatientsEnum.USER_ALREADY_ACTIVE);

    await this.ums.updateUser({ user: _id, isActive: true, password: EncryptionService.encrypt(password) });
    const activatedPatient = await this.pms.updatePatient({ user: _id, state: PatientState.ACTIVE });
    return activatedPatient;
  }
}
