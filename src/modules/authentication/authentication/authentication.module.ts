import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SecurityResolver } from 'src/modules/authentication/authentication/adapters/in/security.resolver';
import { JwtStrategy } from 'src/modules/authentication/authentication/adapters/in/strategies/jwt.strategy';
import { LocalStrategy } from 'src/modules/authentication/authentication/adapters/in/strategies/local.strategy';
import { UsersModule } from 'src/modules/authentication/users/users.module';

import { AuthService } from './application/services/auth.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { SignUpService } from 'src/modules/authentication/authentication/application/services/sign-up.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ClientsModule } from 'src/modules/clients/clients/clients.module';

const services = [AuthService, LocalStrategy, JwtStrategy, SignUpService];
const resolvers = [SecurityResolver];
ProfessionalsPersistenceService
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
    UsersModule,
    ClientsModule,
    ProfessionalsModule
  ],
  providers: [ ...services, ...resolvers],
})
export class AuthenticationModule {}
