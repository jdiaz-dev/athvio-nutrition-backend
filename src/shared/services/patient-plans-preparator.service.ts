import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class PatientPlansPreparatorService {
  public preparePatientPlans<T extends { day: number; meals: any[] }, K>(
    plans: T[],
    params: { patient: string; assignmentStartDate: Date; startingDay?: number },
    patientPlans: K[],
  ): void {
    for (const plan of plans) {
      const adjustedDay = params.startingDay ? plan.day - params.startingDay : plan.day;
      const patientPlan = {
        assignedDate: new Date(
          dayjs(params.assignmentStartDate)
            .set('date', dayjs(params.assignmentStartDate).get('date') + adjustedDay)
            .toString(),
        ),
        patient: params.patient,
        meals: plan.meals,
      };
      patientPlans.push(patientPlan as K);
    }
  }
}
