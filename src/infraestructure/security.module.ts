import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: parseInt(configService.get<string>('security.rateLimit.ttl')),
            limit: parseInt(configService.get<string>('security.rateLimit.limit')),
          },
        ],
      }),
    }),
  ],
})
export class SecurityModule {}
