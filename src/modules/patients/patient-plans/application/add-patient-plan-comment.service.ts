import { Injectable } from '@nestjs/common';
import { AddPatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/patient-plan-comment/add-patient-plan-comment.dto';
import { PatientPlanCommentPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-comment-persistence.service';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { CommenterType } from 'src/shared/enums/project';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

@Injectable()
export class AddPatientPlanCommentService {
  constructor(
    private pms: ProfessionalsManagementService,

    private gps: GetPatientManagerService,
    private cpcps: PatientPlanCommentPersistenceService,
  ) {}

  async addPatientPlanComment(dto: AddPatientPlanCommentDto, selectors: string[]): Promise<PatientPlan> {
    if (dto.commenter.type === CommenterType.PROFESSIONAL) {
      await this.pms.getProfessionalById(dto.commenter.commenterId, { _id: 1 });
    } else {
      await this.gps.getPatientById(dto.commenter.commenterId);
    }

    const patientPlan = await this.cpcps.addPatientPlanComment(dto, selectors);
    return patientPlan;
  }
}
