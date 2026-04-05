import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationModulesService {
  constructor(private readonly configService: ConfigService) {}
  getPatientModuleAccess(professional: string) {
    if (professional === this.configService.get<string>('productionMasterProfessionalId')) {
      return { enabledModules: [{ name: 'programs', isEnabled: true }] };
    } else {
      return { enabledModules: [{ name: 'patient-plans', isEnabled: true }] };
    }
  }
}
