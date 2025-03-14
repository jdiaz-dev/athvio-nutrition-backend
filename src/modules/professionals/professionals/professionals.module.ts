import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { ProfessionalsResolver } from 'src/modules/professionals/professionals/adapters/in/professionals.resolver';
import { Professional, ProfessionalSchema } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';
import { QuestionaryConfigurationModule } from 'src/modules/professionals/questionary-configuration/questionary-configuration.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Professional.name, schema: ProfessionalSchema }]),
    forwardRef(() => AuthenticationModule),
    QuestionaryConfigurationModule,
  ],
  providers: [ProfessionalsResolver, ...[ProfessionalsPersistenceService, ProfessionalsManagementService]],
  exports: [ProfessionalsManagementService, ProfessionalsPersistenceService],
})
export class ProfessionalsModule {}
