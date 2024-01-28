import { PatientsPersistenceService } from './../../patients/adapters/out/patients-persistence.service';
import { Injectable } from '@nestjs/common';
import { AddPatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/patient-plan-comment/add-patient-plan-comment.dto copy';
import { PatientPlanCommentPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-comment-persistence.service';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { CommenterType } from 'src/shared/enums/project';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class AddPatientPlanCommentService {
  constructor(
    private pps: ProfessionalsPersistenceService,

    private cps: PatientsPersistenceService,
    private cpcps: PatientPlanCommentPersistenceService,
  ) {}

  async addPatientPlanComment(dto: AddPatientPlanCommentDto, selectors: string[]): Promise<PatientPlan> {
    if (dto.commenter.type === CommenterType.PROFESSIONAL) {
      await this.pps.getProfessionalById(dto.commenter.commenterId);
    } else {
      await this.cps.getPatientById(dto.commenter.commenterId);
    }

    const patientPlan = await this.cpcps.addPatientPlanComment(dto, selectors);
    return patientPlan;
  }
}
