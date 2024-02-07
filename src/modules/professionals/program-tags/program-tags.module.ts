import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ProgramTagsResolver } from 'src/modules/professionals/program-tags/adapters/in/program-tags.resolver';
import { ProgramTag, ProgramTagSchema } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { ProgramTagsPersistenceService } from 'src/modules/professionals/program-tags/adapters/out/program-tags-persistence.service';
import { ProgramTagsManagementService } from 'src/modules/professionals/program-tags/application/program-tags-persistence.service';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProgramTag.name, schema: ProgramTagSchema }]),
    AuthenticationModule,
    ProfessionalsModule,
  ],
  providers: [ProgramTagsResolver, ...[ProgramTagsPersistenceService, ProgramTagsManagementService]],
  exports: [ProgramTagsPersistenceService],
})
export class ProgramTagsModule {}
