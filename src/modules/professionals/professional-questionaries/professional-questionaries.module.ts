import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/modules/auth/auth/auth.module';
import {
  ProfessionalQuestionary,
  ProfessionalQuestionarySchema,
} from 'src/modules/professionals/professional-questionaries/adapters/out/professional-questionary.schema';
import { ProfessionalQuestionaryPersistenceService } from 'src/modules/professionals/professional-questionaries/adapters/out/professional-questionary-persistence.service';
import { ProfessionalQuestionaryManager } from 'src/modules/professionals/professional-questionaries/application/profesional-questionary-manager.service';
import { ProfessionalQuestionaryResolver } from 'src/modules/professionals/professional-questionaries/adapters/in/professional-questionary.resolver';
import { CustomQuestionaryDetailResolver } from 'src/modules/professionals/professional-questionaries/adapters/in/custom-questionary-detail.resolver';
import { CustomQuestionaryDetailsPersistenceService } from 'src/modules/professionals/professional-questionaries/adapters/out/custom-questionary-details-persistence.service';
import { QuestionaryModule } from 'src/modules/backoffice/internal-questionary/questionary.module';

const resolvers = [ProfessionalQuestionaryResolver, CustomQuestionaryDetailResolver];
const services = [ProfessionalQuestionaryManager, CustomQuestionaryDetailsPersistenceService, ProfessionalQuestionaryPersistenceService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProfessionalQuestionary.name, schema: ProfessionalQuestionarySchema }]),
    forwardRef(() => AuthModule),
    QuestionaryModule,
  ],
  providers: [...resolvers, ...services],
  exports: [ProfessionalQuestionaryManager],
})
export class ProfessionalQuestionariesModule {}
