import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/backoffice/foods/foods.module';
import { InternalQuestionaryModule } from 'src/modules/backoffice/internal-questionary/internal-questionary.module';
import { WorkFlowStreamAuditModule } from 'src/modules/backoffice/work-steram-audit/work-flow-stream-audit.module';

@Module({
  imports: [InternalQuestionaryModule, FoodsModule, WorkFlowStreamAuditModule],
})
export class BackofficeDomainsModule {}
