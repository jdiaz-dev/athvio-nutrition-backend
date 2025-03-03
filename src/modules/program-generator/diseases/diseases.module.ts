import { Module } from '@nestjs/common';
import { DiseasesPersistenceService } from 'src/modules/program-generator/diseases/adapters/out/diseases-persistence.service';
import { DiseasesResolver } from 'src/modules/program-generator/diseases/adapters/in/diseases.resolver';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { DiseasesManagerService } from 'src/modules/program-generator/diseases/application/diseases-manager.service';

@Module({
  imports: [AuthenticationModule],
  providers: [DiseasesResolver, DiseasesManagerService, DiseasesPersistenceService],
  exports: [DiseasesManagerService],
})
export class DiseasesModule {}
