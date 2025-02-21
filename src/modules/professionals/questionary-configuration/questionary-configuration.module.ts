import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import {
  QuestionaryConfig,
  QuestionaryConfigSchema,
} from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { QuestionaryConfigPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config-persistence.service';
import { QuestionaryConfigManager } from 'src/modules/professionals/questionary-configuration/application/questionary-configuration-manager.service';
import { QuestionaryConfigResolver } from 'src/modules/professionals/questionary-configuration/adapters/in/questionary-config.resolver';
import { CustomQuestionaryDetailResolver } from 'src/modules/professionals/questionary-configuration/adapters/in/custom-questionary-detail.resolver';
import { CustomQuestionaryDetailsPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/custom-questionary-details-persistence.service';
import { QuestionaryModule } from 'src/modules/professionals/questionary/adapters/questionary.module';

const resolvers = [QuestionaryConfigResolver, CustomQuestionaryDetailResolver];
const services = [QuestionaryConfigManager, CustomQuestionaryDetailsPersistenceService, QuestionaryConfigPersistenceService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuestionaryConfig.name, schema: QuestionaryConfigSchema }]),
    forwardRef(() => AuthenticationModule),
    QuestionaryModule,
  ],
  providers: [...resolvers, ...services],
  exports: [QuestionaryConfigManager],
})
export class QuestionaryConfigurationModule {}
