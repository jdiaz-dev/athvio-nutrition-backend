import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Disease, DiseaseSchema } from './adapters/out/disease.schema';
import { DiseasesPersistenceService } from 'src/modules/diseases/adapters/out/diseases-persistence.service';
import { DiseasesResolver } from 'src/modules/diseases/adapters/in/diseases.resolver';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Disease.name, schema: DiseaseSchema }]), AuthenticationModule],
  providers: [DiseasesResolver, DiseasesPersistenceService],
  exports: [DiseasesPersistenceService],
})
export class DiseasesModule {}
