import { Injectable } from '@nestjs/common';
import { OtherToolsPersistenceService } from 'src/modules/health/other-tools/adapters/out/other-tool-persistence.service';

@Injectable()
export class OtherToolsManagerService {
  constructor(private otps: OtherToolsPersistenceService) {}

  async getOtherTools(selectors: Record<string, number>) {
    const otherTools = await this.otps.getOtherTools(selectors);
    return otherTools;
  }
}
