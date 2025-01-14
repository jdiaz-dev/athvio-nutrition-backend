import { Injectable } from '@nestjs/common';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { GetPatientPlansForMobileDto } from 'src/modules/patients/patient-plans/adapters/in/mobile/dtos/get-patient-plans-for-mobile.dto';
import { PatientPlanTypeDates } from 'src/modules/patients/patient-plans/helpers/enums';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetPatientPlansForWebDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/get-patient-plans-for-web.dto';

@Injectable()
export class GetPatientPlansManagerService {
  constructor(private ppps: PatientPlansPersistenceService) {}

  async getPatientPlansForWeb(dto: GetPatientPlansForWebDto, selectors: Record<string, number>): Promise<PatientPlan[]> {
    return this.ppps.getPatientPlans(dto, selectors);
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
