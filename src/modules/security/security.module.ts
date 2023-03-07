import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users/users.module';

import { SecurityResolver } from './adapters/in/security.resolver';
import { JwtStrategy } from './adapters/in/strategies/jwt.strategy';
import { LocalStrategy } from './adapters/in/strategies/local.strategy';
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
    UsersModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SecurityResolver],
})
export class SecurityModule {}
