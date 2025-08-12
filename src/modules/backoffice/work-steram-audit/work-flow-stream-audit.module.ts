import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WorkFlowStreamAudit,
  WorkFlowStreamAuditSchema,
} from 'src/modules/backoffice/work-steram-audit/adapters/out/work-flow-stream-audit.schema';
import { WorkFlowStreamAuditPersistenceService } from 'src/modules/backoffice/work-steram-audit/adapters/out/work-flow-stream-audit-persistence.service';
import { WorkFlowStreamAuditManagerService } from 'src/modules/backoffice/work-steram-audit/application/work-stream-audit-manager.service';
import { WorkFlowStreamAuditResolver } from 'src/modules/backoffice/work-steram-audit/adapters/in/work-flow-stream-audit.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: WorkFlowStreamAudit.name, schema: WorkFlowStreamAuditSchema }])],
  providers: [WorkFlowStreamAuditResolver, WorkFlowStreamAuditPersistenceService, WorkFlowStreamAuditManagerService],
  exports: [WorkFlowStreamAuditManagerService],
})
export class WorkFlowStreamAuditModule {}
