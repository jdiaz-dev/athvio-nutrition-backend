import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationResolver } from 'src/modules/authentication/authentication/adapters/in/authentication.resolver';
import { JwtStrategy } from 'src/modules/authentication/authentication/adapters/in/strategies/jwt.strategy';
import { LocalStrategy } from 'src/modules/authentication/authentication/adapters/in/strategies/local.strategy';
import { UsersModule } from 'src/modules/authentication/users/users.module';

import { AuthenticationService } from './application/services/authentication.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { SignUpService } from 'src/modules/authentication/authentication/application/services/sign-up.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { PatientsModule } from 'src/modules/patients/patients/patients.module';
import { AuthorizationService } from 'src/modules/authentication/authentication/application/services/authorization.service';

const services = [AuthenticationService, AuthorizationService, LocalStrategy, JwtStrategy, SignUpService];
const resolvers = [AuthenticationResolver];
ProfessionalsPersistenceService;
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
  ],
  providers: [...services, ...resolvers],
  exports: [AuthorizationService],
})
export class AuthenticationModule {}
