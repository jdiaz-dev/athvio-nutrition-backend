import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const enableSecondDatabase = process.env.NODE_ENV === 'production';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongodb'),
      }),
    }),
    ...(enableSecondDatabase
      ? [
          MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              uri: configService.get<string>('database.mongodb2'),
            }),
            connectionName: 'db_production_2',
          }),
        ]
      : []),
  ],
  exports: [MongooseModule],
})
export class MongoDbModule {}
