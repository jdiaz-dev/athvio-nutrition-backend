import { BadRequestException, Injectable } from '@nestjs/common';
import { Professional } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { CreateProfessional, ProfessionalUser } from 'src/modules/professionals/professionals/adapters/out/professional.types';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { ProfessionalQuestionaryManager } from 'src/modules/professionals/professional-questionaries/application/profesional-questionary-manager.service';
import { ProfessionalMessages } from 'src/shared/enums/messages-response';

//
@Injectable()
export class ProfessionalsManagementService {
  constructor(private pps: ProfessionalsPersistenceService, private qcm: ProfessionalQuestionaryManager) {}

  async createProfessional(createProfessional: Omit<CreateProfessional, 'isTrialPeriod'>): Promise<Professional> {
    const professional = await this.pps.createProfessional({ ...createProfessional, isTrialPeriod: true });
    await this.qcm.createQuestionary(professional._id.toString());
    return professional;
  }
  async getProfessionalById(professional: string, selectors?: Record<string, number>): Promise<ProfessionalUser> {
    const professionalRes = await this.pps.getProfessionalById(professional, selectors);
    if (!professionalRes) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND);
    return professionalRes;
  }
}
