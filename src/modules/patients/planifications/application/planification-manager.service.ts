import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/create-planification.dto';
import { GetPlanificationsDto } from 'src/modules/patients/planifications/adapters/in/dtos/get-planifications.dto';
import { UpdatePlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/update-planification.dto';
import { PlanificationsPersistenceService } from 'src/modules/patients/planifications/adapters/out/planifications-persistence.service';
import { Planification } from 'src/modules/patients/planifications/adapters/out/planification.schema';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ErrorPlanificationEnum } from 'src/shared/enums/messages-response';
import { randomUUID } from 'node:crypto';
import { GetLastPlanificationDto } from 'src/modules/patients/planifications/adapters/in/dtos/get-last-planification.dto';

@Injectable()
export class PlanificationManagerService {
  constructor(
    private gps: GetPatientManagerService,
    private caps: PlanificationsPersistenceService,
  ) {}

  async createPlanification(dto: CreatePlanificationDto): Promise<Planification> {
    await this.gps.getPatientByUuid(dto.patient);
    const planification = await this.caps.createPlanification({ uuid: randomUUID(), ...dto });
    return planification;
  }
  async getLastPlanification(dto: GetLastPlanificationDto, selectors: Record<string, number>): Promise<Planification> {
    const planification = await this.caps.getPlanification(dto, selectors, { sort: { createdAt: -1 } });
    return planification;
  }
  async getPlanifications(dto: GetPlanificationsDto, selectors: Record<string, number>): Promise<Planification[]> {
    const planifications = await this.caps.getPlanifications(dto, selectors);
    return planifications;
  }
  async updatePlanification(dto: UpdatePlanificationDto, selectors: string[]): Promise<Planification> {
    const planificationRes = await this.caps.updatePlanification(dto, selectors);
    if (planificationRes == null) throw new BadRequestException(ErrorPlanificationEnum.PLANIFICATION_NOT_FOUND);
    return planificationRes;
  }
}
