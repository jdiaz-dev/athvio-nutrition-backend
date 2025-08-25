import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/create-planification.dto';
import { GetPlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/get-calory.dto';
import { updatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/update-calory.dto';
import { PlanificationsPersistenceService } from 'src/modules/patients/planifications/adapters/out/planifications-persistence.service';
import { Planification } from 'src/modules/patients/planifications/adapters/out/planification.schema';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ErrorCaloryEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PlanificationManagerService {
  constructor(
    private gps: GetPatientManagerService,
    private caps: PlanificationsPersistenceService,
  ) {}

  async createPlanification(dto: CreatePlanificationDto): Promise<Planification> {
    await this.gps.getPatientById(dto.patient);
    const planification = await this.caps.createPlanification(dto);
    return planification;
  }
  async getPlanification(dto: GetPlanificationDto, selectors: Record<string, number>): Promise<Planification> {
    const planificationRes = await this.caps.getPlanification(dto, selectors);
    if (!planificationRes) throw new BadRequestException(ErrorCaloryEnum.CALORY_NOT_FOUND);

    return planificationRes;
  }
  async getPlanifications(dto: GetPlanificationDto, selectors: Record<string, number>): Promise<Planification[]> {
    const planifications = await this.caps.getPlanifications(dto, selectors);
    return planifications;
  }
  async updatePlanification(dto: updatePlanificationDto, selectors: string[]): Promise<Planification> {
    const planificationRes = await this.caps.updatePlanification(dto, selectors);
    if (planificationRes == null) throw new BadRequestException(ErrorCaloryEnum.CALORY_NOT_FOUND);
    return planificationRes;
  }
}
