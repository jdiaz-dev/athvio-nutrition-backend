import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { UsersPersistenceService } from 'src/modules/auth/users/adapters/out/users-persistence.service';
import { CreateUser } from 'src/modules/auth/users/adapters/out/users-types';
import { AuthenticationService } from 'src/modules/auth/auth/application/services/authentication.service';
import { UserLoged } from 'src/modules/auth/auth/helpers/auth.types';
import { EnumRoles, LayersServer } from 'src/shared/enums/project';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { EncryptionService } from 'src/modules/auth/auth/application/services/encryption.service';
import { SignUpProfessionalDto } from 'src/modules/auth/auth/adapters/in/web/dtos/sign-up-professional.dto';
import { SignUpPatientManagamentService } from 'src/modules/auth/auth/application/services/sign-up-patient-management.service';

@Injectable()
export class SignUpProfessionalService {
  private layer = LayersServer.APPLICATION;
  constructor(
    private ups: UsersPersistenceService,
    private prms: ProfessionalsManagementService,
    private as: AuthenticationService,
    private supms: SignUpPatientManagamentService,
  ) {}

  async signUpProfessional({ professionalInfo, ...userDto }: SignUpProfessionalDto): Promise<UserLoged> {
    const user = await this.ups.getUserByEmail(userDto.email);
    if (user) throw new BadRequestException(ErrorUsersEnum.EMAIL_EXISTS, this.layer);

    const _user: CreateUser = {
      ...userDto,
      password: EncryptionService.encrypt(userDto.password),
      role: EnumRoles.PROFESSIONAL,
      isActive: true,
    };
    const { _id, role } = await this.ups.createUser(_user);

    const { _id: professional } = await this.prms.createProfessional({
      user: _id,
      ...professionalInfo,
    });

    await this.supms.signUpPatientFromWeb(
      {
        professional,
        userInfo: {
          firstname: 'patient',
          lastname: 'demo',
          email: `demo_${userDto.email}`,
        },
      },
      true,
    );
    //create program
    return this.as.generateToken({ _id, role });
  }
  async assignRecordsForDemo() {}
}
