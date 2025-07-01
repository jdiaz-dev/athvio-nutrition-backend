import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { OnboardingModule } from 'src/modules/auth/onboarding/onboarding.module';
import { UsersModule } from 'src/modules/auth/users/users.module';

@Module({
  imports: [UsersModule, AuthModule, OnboardingModule],
})
export class AuthSubDomainsModule {}
