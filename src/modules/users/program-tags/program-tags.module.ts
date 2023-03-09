import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramTagsResolver } from 'src/modules/users/program-tags/adapters/in/program-tags.resolver';
import { ProgramTag, ProgramTagSchema } from 'src/modules/users/program-tags/adapters/out/program-tag.schema';
import { ProgramTagsPersistenceService } from 'src/modules/users/program-tags/adapters/out/program-tags-persistence.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProgramTag.name, schema: ProgramTagSchema }])],
  providers: [ProgramTagsResolver, ProgramTagsPersistenceService],
  exports: [ProgramTagsPersistenceService],
})
export class ProgramTagsModule {}
