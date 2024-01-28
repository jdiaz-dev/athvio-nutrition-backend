import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientManagementService {
  constructor(
    /* private cps: PatientsPersistenceService,
    private ums: UserManagementService,
    private ups: UsersPersistenceService,
    private pps: ProfessionalsPersistenceService, */
  ) {}

  /* async createPatient({ professional, userInfo, additionalInfo }: CreatePatientDto): Promise<CreatePatientResponse> {
    const userEmail = await this.ups.getUserByEmail(userInfo.email);
    if (userEmail) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS);

    await this.pps.getProfessionalById(professional);

    const patient = await this.cps.createPatient({ professional, ...additionalInfo, isActive: true });
    const _user: CreateUser = {
      ...userInfo,
      patient: patient._id,
    };
    
    if (additionalInfo.countryCode) _user.countryCode = additionalInfo.countryCode;
    if (additionalInfo.country) _user.country = additionalInfo.country;

    const user = await this.ums.createUserAndPatient(_user);
    await this.cps.updateUser(patient._id, user._id);

    const _patient = {
      ...patient,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
    return _patient;
  } */
  /* //TODO: without use still, create and enpoint for it
  async activatePatient({ updateUserInfo, ...rest }: UpdatePatientMobileDto, selectors: string[]): Promise<Patient> {
    await this.ums.activateUserAndPatient(updateUserInfo);
    const _patient = {
      ...rest,
      state: PatientState.ACTIVE,
      isActive: true,
    };
    const patient = await this.cps.updatePatient(_patient, selectors);
    return patient;
  } */
}
