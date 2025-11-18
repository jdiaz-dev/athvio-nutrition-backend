import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InternalQuestionaryPersistenceService } from 'src/modules/nutrition/internal-questionary/adapters/out/internal-questionary-persistence.service';
import {
  InternalQuestionary,
  InternalQuestionarySchema,
} from 'src/modules/nutrition/internal-questionary/adapters/out/internal-questionary.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: InternalQuestionary.name, schema: InternalQuestionarySchema }])],
  providers: [InternalQuestionaryPersistenceService],
  exports: [InternalQuestionaryPersistenceService],
})
export class InternalQuestionaryModule {}
