import { Injectable } from '@nestjs/common';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { GetPatientPlansForMobileDto } from 'src/modules/patients/patient-plans/adapters/in/mobile/dtos/get-patient-plans-for-mobile.dto';
import { PatientPlanTypeDates } from 'src/modules/patients/patient-plans/helpers/enums';
import { GetRecordsBaseDto } from 'src/shared/adapters/in/dtos/get-records-base.dto';
import { GetPatientPlansForWebDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/get-patient-plans-for-web.dto';
import { PatientWithAssignedDate } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.type';

@Injectable()
export class GetPatientPlansManagerService {
  constructor(private ppps: PatientPlansPersistenceService) {}

  async getManyPatientPlans(
    patientWithAssignedDate: PatientWithAssignedDate[],
    selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    const patientPlans = await this.ppps.getManyPatientPlans(patientWithAssignedDate, selectors);
    return patientPlans;
  }
  async getPatientPlansForWeb(
    { startDate, endDate, ...restDto }: GetPatientPlansForWebDto,
    selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    return this.ppps.getPatientPlans(restDto, selectors, { assignedDate: { $gte: new Date(startDate), $lte: new Date(endDate) } });
  }
  async getPatientPlansForMobile(dto: GetPatientPlansForMobileDto, selectors: Record<string, number>): Promise<PatientPlan[]> {
    let planDatesFilter;
    if (this.isMobileDto(dto)) {
      planDatesFilter =
        dto.patientPlanTypeDate === PatientPlanTypeDates.UPCOMING
          ? {
              assignedDate: {
                $gte: new Date(dto.currentDate),
              },
            }
          : {
              assignedDate: {
                $lt: new Date(dto.currentDate),
              },
            };
    }
    return this.ppps.getPatientPlans(dto, selectors, planDatesFilter);
  }
  private isMobileDto(dto: GetRecordsBaseDto): dto is GetPatientPlansForMobileDto {
    return 'patientPlanTypeDate' in dto && 'currentDate' in dto;
  }
}
