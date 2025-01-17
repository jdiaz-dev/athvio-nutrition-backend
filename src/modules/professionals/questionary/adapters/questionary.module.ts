import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionaryPersistenceService } from 'src/modules/professionals/questionary/adapters/out/questinary-persistence.service';
import { Questionary, QuestionarySchema } from 'src/modules/professionals/questionary/adapters/out/questionary.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Questionary.name, schema: QuestionarySchema }])],
  providers: [QuestionaryPersistenceService],
  exports: [QuestionaryPersistenceService],
})
export class QuestionaryModule {}
