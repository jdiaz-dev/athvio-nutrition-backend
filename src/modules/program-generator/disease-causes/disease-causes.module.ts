import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { DiseaseCausesPersistenceService } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause-persistence.service';
import { DiseaseCausesResolver } from 'src/modules/program-generator/disease-causes/adapters/in/diseases.resolver';
import { DiseaseCause, DiseaseCauseSchema } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DiseaseCause.name, schema: DiseaseCauseSchema }]), AuthenticationModule],
  providers: [DiseaseCausesResolver, DiseaseCausesPersistenceService],
  exports: [DiseaseCausesPersistenceService],
})
export class DiseaseCausesModule {}
