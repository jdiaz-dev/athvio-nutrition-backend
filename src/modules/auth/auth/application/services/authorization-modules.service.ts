import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationModulesService {
  constructor(private readonly configService: ConfigService) {}
  getPatientModuleAccess(professional: string) {
    if (professional === this.configService.get<string>('productionMasterProfessionalId')) {
      return { assignedModule: 'programs' };
    } else {
      return { assignedModule: 'patient-plans' };
    }
  }
}
