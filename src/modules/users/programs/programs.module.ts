import { Module } from '@nestjs/common';
import { ProgramsResolver } from './adapters/in/programs.resolver';
import { PrograsPersistenceService } from './adapters/out/progras-persistence.service';

@Module({
  providers: [ProgramsResolver, PrograsPersistenceService]
})
export class ProgramsModule {}
