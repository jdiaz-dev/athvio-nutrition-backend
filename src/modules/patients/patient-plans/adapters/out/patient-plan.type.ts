import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';

export type CreatePatientPlanBody = Pick<PatientPlan, 'uuid' | 'patient' | 'assignedDate' | 'meals'> &
  Partial<Pick<PatientPlan, 'title'>>;

export interface PatientPlanPartial extends Pick<PatientPlan, 'uuid' | 'patient' | 'assignedDate' | 'meals'> {}

export interface PatientWithAssignedDate extends Pick<PatientPlan, 'patient' | 'assignedDate' | 'isDeleted'> {}
