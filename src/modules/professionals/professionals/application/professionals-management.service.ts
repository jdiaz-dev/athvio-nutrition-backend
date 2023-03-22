import { Injectable } from '@nestjs/common';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class ProfessionalsManagementService {
  constructor(private pms: ProfessionalsPersistenceService) {
    this.pms;
  }
}
