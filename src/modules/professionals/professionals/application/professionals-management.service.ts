import { BadRequestException, Injectable } from '@nestjs/common';
import { GetProfessionalDto } from 'src/modules/professionals/professionals/adapters/in/dtos/get-professional.dt';
import { Professional } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { CreateProfessional } from 'src/modules/professionals/professionals/adapters/out/professional.types';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { QuestionaryConfigManager } from 'src/modules/professionals/questionary-configuration/application/questionary-configuration-manager.service';
import { ProfessionalMessages } from 'src/shared/enums/messages-response';

//
@Injectable()
export class ProfessionalsManagementService {
  constructor(private pps: ProfessionalsPersistenceService, private qcm: QuestionaryConfigManager) {}

  //todo: receive professional throught a queue
  async createProfessional(createProfessional: Omit<CreateProfessional, 'isTrialPeriod'>): Promise<Professional> {
    const professional = await this.pps.createProfessional({ ...createProfessional, isTrialPeriod: true });
    await this.qcm.createQuestionary(professional._id);
    return professional;
  }

  async getProfessional(dto: GetProfessionalDto, selectors: Record<string, number>): Promise<Professional> {
    const professional = await this.pps.getProfessionalById(dto.professional, selectors);
    if (!professional) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND);
    return professional;
  }
  async getProfessionalById(professional: string): Promise<Professional> {
    const prof = await this.pps.getProfessionalById(professional, { _id: 1 });
    return prof;
  }
}
