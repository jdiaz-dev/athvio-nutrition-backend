import { PatientPlan } from "src/modules/patients/patient-plans/adapters/out/patient-plan.schema";

export interface PatientPlanPartial extends Pick<PatientPlan, 'patient' | 'assignedDate' | 'meals'> {}

export interface PatientWithAssignedDate extends Pick<PatientPlan, 'patient' | 'assignedDate' | 'isDeleted'> {}