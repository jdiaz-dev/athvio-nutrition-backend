import { ClientPlan } from "src/modules/clients/client-plans/adapters/out/client-plan.schema";

export interface ClientPlanPartial extends Pick<ClientPlan, 'client' | 'assignedDate' | 'meals'> {}

export interface ClientWithAssignedDate extends Pick<ClientPlan, 'client' | 'assignedDate' | 'isDeleted'> {}