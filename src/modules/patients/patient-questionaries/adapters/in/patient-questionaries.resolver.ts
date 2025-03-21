import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';

import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver(() => Patient)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientQuestionariesResolver {}
