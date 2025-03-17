import { Module } from '@nestjs/common';
import { DiseasesPersistenceService } from 'src/modules/program-generator/diseases/adapters/out/diseases-persistence.service';
import { DiseasesResolver } from 'src/modules/program-generator/diseases/adapters/in/diseases.resolver';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { DiseasesManagerService } from 'src/modules/program-generator/diseases/application/diseases-manager.service';

@Module({
  imports: [AuthModule],
  providers: [DiseasesResolver, DiseasesManagerService, DiseasesPersistenceService],
  exports: [DiseasesManagerService],
})
export class DiseasesModule {}
