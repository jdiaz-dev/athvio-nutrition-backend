import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_DB_CONNECTION'),
        maxPoolSize: 100,
        minPoolSize: 10,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDbModule {}
