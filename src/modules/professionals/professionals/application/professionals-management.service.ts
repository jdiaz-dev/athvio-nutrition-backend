import { Injectable } from '@nestjs/common';
import { CreateProfessional } from 'src/modules/professionals/professionals/adapters/out/professional.types';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class ProfessionalsManagementService {
  constructor(private pms: ProfessionalsPersistenceService) {}

  async createProfessional(body: CreateProfessional) {
    const professional = await this.pms.createProfessional(body);
    return professional;
  }
  async getProfessionalById(professionalId: string) {
    const professional = await this.pms.getProfessionalById(professionalId);
    return professional;
  }
}
