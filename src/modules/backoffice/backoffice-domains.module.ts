import { Module } from '@nestjs/common';
import { InternalQuestionaryModule } from 'src/modules/backoffice/internal-questionary/internal-questionary.module';
import { TelemetryModule } from 'src/modules/backoffice/telemetry/telemetry.module';
import { WorkFlowStreamAuditModule } from 'src/modules/backoffice/work-steram-audit/work-flow-stream-audit.module';

@Module({
  imports: [InternalQuestionaryModule, WorkFlowStreamAuditModule, TelemetryModule],
})
export class BackofficeDomainsModule {}
