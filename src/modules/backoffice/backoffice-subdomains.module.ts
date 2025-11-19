import { Module } from '@nestjs/common';
import { TelemetryModule } from 'src/modules/backoffice/telemetry/telemetry.module';
import { WorkFlowStreamAuditModule } from 'src/modules/backoffice/work-steram-audit/work-flow-stream-audit.module';

@Module({
  imports: [WorkFlowStreamAuditModule, TelemetryModule],
})
export class BackofficeDomainsModule {}
