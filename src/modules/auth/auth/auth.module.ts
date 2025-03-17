import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProfessionalOnboardingResolver } from 'src/modules/auth/auth/adapters/in/web/professional-onboarding.resolver';
import { JwtStrategy } from 'src/modules/auth/auth/adapters/in/web/strategies/jwt.strategy';
import { LocalStrategy } from 'src/modules/auth/auth/adapters/in/web/strategies/local.strategy';
import { UsersModule } from 'src/modules/auth/users/users.module';

import { AuthenticationService } from './application/services/authentication.service';
import { SignUpProfessionalService } from 'src/modules/auth/auth/application/services/sign-up-professional.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { AuthorizationService } from 'src/modules/auth/auth/application/services/authorization.service';
import { SignUpPatientManagamentService } from 'src/modules/auth/auth/application/services/sign-up-patient-management.service';
import { MailModule } from 'src/modules/mail/mail.module';
import { PatientOnboardingMobileResolver } from 'src/modules/auth/auth/adapters/in/mobile/patient-onboarding-mobile.resolver';
import { PatientOnboardingWebResolver } from 'src/modules/auth/auth/adapters/in/web/patient-onboarding-web.resolver';
import { MobileWebAuthenticationResolver } from 'src/modules/auth/auth/adapters/in/mobile-web-authentication.resolver';

const services = [
  AuthenticationService,
  AuthorizationService,
  LocalStrategy,
  JwtStrategy,
  SignUpProfessionalService,
  SignUpPatientManagamentService,
];
const resolvers = [
  ProfessionalOnboardingResolver,
  PatientOnboardingWebResolver,
  PatientOnboardingMobileResolver,
  MobileWebAuthenticationResolver,
];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('tokenKey'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => ProfessionalsModule),
    MailModule,
  ],
  providers: [...services, ...resolvers],
  exports: [AuthorizationService],
})
export class AuthModule {}
