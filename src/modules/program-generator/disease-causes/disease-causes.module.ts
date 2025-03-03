import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { DiseaseCausesPersistenceService } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause-persistence.service';
import { DiseaseCausesResolver } from 'src/modules/program-generator/disease-causes/adapters/in/disease-causes.resolver';
import { DiseaseCausesManagerService } from 'src/modules/program-generator/disease-causes/application/disease-causes-manager.service';

@Module({
  imports: [AuthenticationModule],
  providers: [DiseaseCausesResolver, DiseaseCausesManagerService, DiseaseCausesPersistenceService],
  exports: [DiseaseCausesManagerService],
})
export class DiseaseCausesModule {}
