import { Injectable } from '@nestjs/common';
import { AddPatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/patient-plan-comment/add-patient-plan-comment.dto';
import { PatientPlanCommentPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-comment-persistence.service';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { CommenterType } from 'src/shared/enums/project';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';

@Injectable()
export class AddPatientPlanCommentService {
  constructor(
    private pps: ProfessionalsPersistenceService,

    private gps: GetPatientsService,
    private cpcps: PatientPlanCommentPersistenceService,
  ) {}

  async addPatientPlanComment(dto: AddPatientPlanCommentDto, selectors: string[]): Promise<PatientPlan> {
    if (dto.commenter.type === CommenterType.PROFESSIONAL) {
      await this.pps.getProfessionalById(dto.commenter.commenterId, { _id: 1 });
    } else {
      await this.gps.getPatientById(dto.commenter.commenterId);
    }

    const patientPlan = await this.cpcps.addPatientPlanComment(dto, selectors);
    return patientPlan;
  }
}
