import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ProgramTagsResolver } from 'src/modules/professionals/program-tags/adapters/in/program-tags.resolver';
import { ProgramTag, ProgramTagSchema } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { ProgramTagsPersistenceService } from 'src/modules/professionals/program-tags/adapters/out/program-tags-persistence.service';
import { ProgramTagsManagerService } from 'src/modules/professionals/program-tags/application/program-tags-manager.service';
import { AuthModule } from 'src/modules/auth/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProgramTag.name, schema: ProgramTagSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProfessionalsModule),
  ],
  providers: [ProgramTagsResolver, ...[ProgramTagsPersistenceService, ProgramTagsManagerService]],
  exports: [ProgramTagsPersistenceService],
})
export class ProgramTagsModule {}
