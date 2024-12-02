import { Injectable } from '@nestjs/common';
import { PatientPlanPartial, PatientWithAssignedDate } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.type';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { AssignProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/assign-program.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import dayjs from 'dayjs';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { Plan } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramPatial } from 'src/modules/professionals/programs/adapters/out/program.d';
import { programPlanSelector } from 'src/modules/professionals/programs/adapters/out/program-plan-selectors';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';

@Injectable()
export class AssignProgramService {
  constructor(
    private gps: GetPatientsService,
    private cpps: PatientPlansPersistenceService,
    private pps: PlansPersistenceService,
    private prps: ProgramsPersistenceService
  ) {}

  private preparePatientPlanBodies(plans: Plan[], dto: AssignProgramDto): PatientPlanPartial[] {
    const patientPlans: PatientPlanPartial[] = [];

    let patientPlan: PatientPlanPartial;
    for (const patient of dto.patients) {
      for (const plan of plans) {
        const precitionDay = plan.day - dto.startingDay;
        patientPlan = {
          assignedDate: new Date(dayjs(dto.assignmentStartDate).set('date', dayjs(dto.assignmentStartDate).get('date') + precitionDay).toString()),
          patient: patient,
          meals: plan.meals
        };
        patientPlans.push(patientPlan);
      }
    }
    return patientPlans;
  }
  private async manageProgramSyncronization(newPatientPlans: PatientPlanPartial[], program: ProgramPatial) {
    const patientPlansToSearch: PatientWithAssignedDate[] = newPatientPlans.map((patientPlan) => ({ patient: patientPlan.patient, assignedDate: patientPlan.assignedDate, isDeleted: false }));

    if (program.isSyncActive && program.patients.length === 0) {
      //TODO: remove patientPlans and full again patientPlans
    } else {
      const patientPlans = await this.cpps.getManyPatientPlans(patientPlansToSearch, { _id: 1, assignedDate: 1 });
      newPatientPlans = newPatientPlans.filter((newPatientPlan) => {
        let patientPlanFound = patientPlans.filter((patientPlan) => newPatientPlan.assignedDate.toString() === patientPlan.assignedDate.toString()
        );
        return patientPlanFound.length >= 1 ? 0 : 1;
      });
    }
  }
  async assignProgramToPatient(dto: AssignProgramDto): Promise<PatientPlan[]> {
    await this.gps.getManyPatientsByIds(dto.patients);
    const program = await this.pps.getProgramPlanFilteredByDay({ professional: dto.professional, program: dto.program, day: dto.startingDay }, programPlanSelector);
    const newPatientPlans: PatientPlanPartial[] = this.preparePatientPlanBodies(program.plans, dto);

    await this.manageProgramSyncronization(newPatientPlans, program);
    const res = await this.cpps.createManyPatientPlan(newPatientPlans);
    await this.prps.updateProgramPatients(dto.program, dto.professional, dto.patients);
    return res;
  }

}
