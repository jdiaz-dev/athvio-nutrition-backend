import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramTagsResolver } from './adapters/in/program-tags.resolver';
import { ProgramTagsPersistenceService } from './adapters/out/program-tags-persistence.service';
import { ProgramTag, ProgramTagSchema } from './adapters/out/program-tag.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProgramTag.name, schema: ProgramTagSchema }])],
  providers: [ProgramTagsResolver, ProgramTagsPersistenceService],
})
export class ProgramTagsModule {}
