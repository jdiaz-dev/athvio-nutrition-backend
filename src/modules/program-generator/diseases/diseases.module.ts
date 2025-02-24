import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiseasesPersistenceService } from 'src/modules/program-generator/diseases/adapters/out/diseases-persistence.service';
import { DiseasesResolver } from 'src/modules/program-generator/diseases/adapters/in/diseases.resolver';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { Disease, DiseaseSchema } from 'src/modules/program-generator/diseases/adapters/out/disease.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Disease.name, schema: DiseaseSchema }]), AuthenticationModule],
  providers: [DiseasesResolver, DiseasesPersistenceService],
  exports: [DiseasesPersistenceService],
})
export class DiseasesModule {}
