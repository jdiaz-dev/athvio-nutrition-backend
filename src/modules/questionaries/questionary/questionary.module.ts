import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionaryPersistenceService } from 'src/modules/questionaries/questionary/adapters/out/questionary-persistence.service';
import { Questionary, QuestionarySchema } from 'src/modules/questionaries/questionary/adapters/out/questionary.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Questionary.name, schema: QuestionarySchema }])],
  providers: [QuestionaryPersistenceService],
  exports: [QuestionaryPersistenceService],
})
export class QuestionaryModule {}
