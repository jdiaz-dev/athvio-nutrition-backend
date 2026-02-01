import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientPlanPartial, PatientWithAssignedDate } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.type';
import { AssignProgramDto } from 'src/modules/professionals/programs/adapters/in/web/dtos/program/assign-program.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { Plan } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramPatial } from 'src/modules/professionals/programs/types/program';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { ErrorProgramEnum } from 'src/shared/enums/messages-response';
import { PatientPlansPreparatorService } from 'src/shared/application/patient-plans-preparator.service';
import { CreatePatientPlanManagerService } from 'src/modules/patients/patient-plans/application/create-patient-plan-manager.service';
import { GetPatientPlansManagerService } from 'src/modules/patients/patient-plans/application/get-patient-plans-manager.service';

@Injectable()
export class AssignProgramService {
  constructor(
    private readonly gps: GetPatientManagerService,
    private readonly cppms: CreatePatientPlanManagerService,
    private readonly gppms: GetPatientPlansManagerService,
    private readonly pps: PlansPersistenceService,
    private readonly prps: ProgramsPersistenceService,
    private readonly ppps: PatientPlansPreparatorService,
  ) {}

  private prepareAssignedPatientPlans(plans: Plan[], dto: AssignProgramDto): PatientPlanPartial[] {
    const patientPlans: PatientPlanPartial[] = [];

    for (const patient of dto.patients) {
      this.ppps.preparePatientPlans<Plan, PatientPlanPartial>(
        plans,
        { patient, assignmentStartDate: dto.assignmentStartDate, startingDay: dto.startingDay },
        patientPlans,
      );
    }
    return patientPlans;
  }
  private async manageProgramSyncronization(newPatientPlans: PatientPlanPartial[], program: ProgramPatial) {
    const patientPlansToSearch: PatientWithAssignedDate[] = newPatientPlans.map((patientPlan) => ({
      patient: patientPlan.patient,
      assignedDate: patientPlan.assignedDate,
      isDeleted: false,
    }));

    if (program.isSyncActive && program.patients.length === 0) {
      //TODO: remove patientPlans and full again patientPlans
    } else {
      const patientPlans = await this.gppms.getManyPatientPlans(patientPlansToSearch, { _id: 1, assignedDate: 1 });
      newPatientPlans = newPatientPlans.filter((newPatientPlan) => {
        let patientPlanFound = patientPlans.filter(
          (patientPlan) => newPatientPlan.assignedDate.toString() === patientPlan.assignedDate.toString(),
        );
        return patientPlanFound.length >= 1 ? 0 : 1;
      });
    }
  }
  async assignProgramToPatient(dto: AssignProgramDto): Promise<PatientPlan[]> {
    await this.gps.getManyPatientsByIds(dto.patients);
    const program = await this.pps.getProgramPlanFilteredByDay(
      { professional: dto.professional, program: dto.program, day: dto.startingDay },
      { plans: 1, name: 1, description: 1 },
    );

    if (program == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);
    const newPatientPlans: PatientPlanPartial[] = this.prepareAssignedPatientPlans(program.plans, dto);

    await this.manageProgramSyncronization(newPatientPlans, program);
    const res = await this.cppms.createManyPatientPlan(newPatientPlans);
    const programUpdated = await this.prps.updateProgramPatients(dto.program, dto.professional, dto.patients);
    if (programUpdated == null) throw new BadRequestException(ErrorProgramEnum.PROGRAM_NOT_FOUND);

    return res;
  }
}
