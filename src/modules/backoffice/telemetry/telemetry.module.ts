import { Module } from '@nestjs/common';
import { TelemetryResolver } from 'src/modules/backoffice/telemetry/adapters/in/telemetry.resolver';

@Module({
  providers: [TelemetryResolver],
})
export class TelemetryModule {}
