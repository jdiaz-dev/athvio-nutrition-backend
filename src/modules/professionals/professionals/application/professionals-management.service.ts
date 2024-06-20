import { BadRequestException, Injectable } from '@nestjs/common';
import { GetProfessionalDto } from 'src/modules/professionals/professionals/adapters/in/dtos/get-professional.dt';
import { Professional } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { ProfessionalMessages } from 'src/shared/enums/messages-response';

@Injectable()
export class ProfessionalsManagementService {
  constructor(private pms: ProfessionalsPersistenceService) {
    this.pms;
  }
  async getProfessional(dto: GetProfessionalDto, selectors: Record<string, number>): Promise<Professional> {
    const professional = await this.pms.getProfessionalById(dto.professional, selectors);
    if (!professional) throw new BadRequestException(ProfessionalMessages.PROFESSIONAL_NOT_FOUND);
    return professional;
  }
}
