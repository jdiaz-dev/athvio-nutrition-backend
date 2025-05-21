import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/modules/auth/auth/auth.module';
import {
  QuestionaryConfig,
  QuestionaryConfigSchema,
} from 'src/modules/questionaries/questionary-configuration/adapters/out/questionary-config.schema';
import { QuestionaryConfigPersistenceService } from 'src/modules/questionaries/questionary-configuration/adapters/out/questionary-config-persistence.service';
import { QuestionaryConfigManager } from 'src/modules/questionaries/questionary-configuration/application/questionary-configuration-manager.service';
import { QuestionaryConfigResolver } from 'src/modules/questionaries/questionary-configuration/adapters/in/questionary-config.resolver';
import { CustomQuestionaryDetailResolver } from 'src/modules/questionaries/questionary-configuration/adapters/in/custom-questionary-detail.resolver';
import { CustomQuestionaryDetailsPersistenceService } from 'src/modules/questionaries/questionary-configuration/adapters/out/custom-questionary-details-persistence.service';
import { QuestionaryModule } from 'src/modules/questionaries/questionary/questionary.module';

const resolvers = [QuestionaryConfigResolver, CustomQuestionaryDetailResolver];
const services = [QuestionaryConfigManager, CustomQuestionaryDetailsPersistenceService, QuestionaryConfigPersistenceService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuestionaryConfig.name, schema: QuestionaryConfigSchema }]),
    forwardRef(() => AuthModule),
    QuestionaryModule,
  ],
  providers: [...resolvers, ...services],
  exports: [QuestionaryConfigManager],
})
export class QuestionaryConfigurationModule {}
