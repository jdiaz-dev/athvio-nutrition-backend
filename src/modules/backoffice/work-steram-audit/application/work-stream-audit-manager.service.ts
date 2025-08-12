import { Injectable } from '@nestjs/common';
import { WorkFlowStreamAudit } from 'src/modules/backoffice/work-steram-audit/adapters/out/work-flow-stream-audit.schema';
import { WorkFlowStreamAuditPersistenceService } from 'src/modules/backoffice/work-steram-audit/adapters/out/work-flow-stream-audit-persistence.service';

@Injectable()
export class WorkFlowStreamAuditManagerService {
  constructor(private readonly wfsap: WorkFlowStreamAuditPersistenceService) {}
  async createWorkFlowStreamAudit(
    data: Pick<WorkFlowStreamAudit, 'uuid' | 'path' | 'operation' | 'body'>,
  ): Promise<WorkFlowStreamAudit> {
    return this.wfsap.createWorkFlowStreamAudit(data);
  }
  async updateWorkFlowStreamAudit(
    data: Pick<WorkFlowStreamAudit, 'uuid'> & Partial<Pick<WorkFlowStreamAudit, 'response' | 'error'>>,
  ): Promise<WorkFlowStreamAudit> {
    return this.wfsap.updateWorkFlowStreamAudit(data);
  }
}
