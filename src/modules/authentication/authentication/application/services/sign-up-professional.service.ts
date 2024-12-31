import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorUsersEnum } from 'src/shared/enums/messages-response';
import { UsersPersistenceService } from 'src/modules/authentication/users/adapters/out/users-persistence.service';
import { CreateUser } from 'src/modules/authentication/users/adapters/out/users-types';
import { SignUpProfessionalDto } from 'src/modules/authentication/authentication/adapters/in/dtos/sign-up-professional.dto';
import { AuthenticationService } from 'src/modules/authentication/authentication/application/services/authentication.service';
import { UserLoged } from 'src/modules/authentication/authentication/application/services/auth.types';
import { EnumRoles, LayersServer } from 'src/shared/enums/project';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { EncryptionService } from 'src/modules/authentication/authentication/application/services/encryption.service';

@Injectable()
export class SignUpProfessionalService {
  private layer = LayersServer.APPLICATION;
  constructor(
    private ups: UsersPersistenceService,
    private prms: ProfessionalsManagementService,
    private as: AuthenticationService,
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

    await this.prms.createProfessional({
      user: _id,
      ...professionalInfo,
    });
    return this.as.generateToken({ _id, role });
  }
}
