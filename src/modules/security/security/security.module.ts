import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SecurityResolver } from 'src/modules/security/security/adapters/in/security.resolver';
import { JwtStrategy } from 'src/modules/security/security/adapters/in/strategies/jwt.strategy';
import { LocalStrategy } from 'src/modules/security/security/adapters/in/strategies/local.strategy';
import { UsersModule } from 'src/modules/security/users/users.module';

import { AuthService } from './application/services/auth.service';

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
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SecurityResolver],
})
export class SecurityModule {}
