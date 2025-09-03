import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/backoffice/foods/foods.module';
import { FormulasModule } from 'src/modules/backoffice/formulas/formulas.module';
import { InternalQuestionaryModule } from 'src/modules/backoffice/internal-questionary/internal-questionary.module';
import { TelemetryModule } from 'src/modules/backoffice/telemetry/telemetry.module';
import { WorkFlowStreamAuditModule } from 'src/modules/backoffice/work-steram-audit/work-flow-stream-audit.module';

@Module({
  imports: [InternalQuestionaryModule, FoodsModule, WorkFlowStreamAuditModule, FormulasModule, TelemetryModule],
})
export class BackofficeDomainsModule {}
