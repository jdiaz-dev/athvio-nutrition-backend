import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { UsersModule } from 'src/modules/auth/users/users.module';

@Module({
  imports: [UsersModule, AuthModule],
})
export class AuthSubDomainsModule {}
