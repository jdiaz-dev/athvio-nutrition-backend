import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { ProfessionalsResolver } from 'src/modules/professionals/professionals/adapters/in/professionals.resolver';
import { Professional, ProfessionalSchema } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';
import { ProfessionalsManagementService } from 'src/modules/professionals/professionals/application/professionals-management.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Professional.name, schema: ProfessionalSchema }]), forwardRef(() => AuthModule)],
  providers: [ProfessionalsResolver, ...[ProfessionalsPersistenceService, ProfessionalsManagementService]],
  exports: [ProfessionalsManagementService],
})
export class ProfessionalsModule {}
