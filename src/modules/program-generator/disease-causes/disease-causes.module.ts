import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { DiseaseCausesPersistenceService } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause-persistence.service';
import { DiseaseCausesResolver } from 'src/modules/program-generator/disease-causes/adapters/in/disease-causes.resolver';

@Module({
  imports: [AuthenticationModule],
  providers: [DiseaseCausesResolver, DiseaseCausesPersistenceService],
  exports: [DiseaseCausesPersistenceService],
})
export class DiseaseCausesModule {}
