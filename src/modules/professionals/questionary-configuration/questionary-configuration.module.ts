import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import {
  QuestionaryConfig,
  QuestionaryConfigSchema,
} from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { QuestionaryConfigPersistenceService } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config-persistence.service';
import { QuestionaryConfigManager } from 'src/modules/professionals/questionary-configuration/application/questionary-configuration-manager.service';
import { QuestionaryConfigResolver } from 'src/modules/professionals/questionary-configuration/adapters/in/questionary-config.resolver';
import { OtherQuestionaryDetailResolver } from 'src/modules/professionals/questionary-configuration/adapters/in/other-questionary-detail.resolver';

const resolvers = [QuestionaryConfigResolver, OtherQuestionaryDetailResolver];
const services = [QuestionaryConfigManager, QuestionaryConfigPersistenceService];

@Module({
  imports: [MongooseModule.forFeature([{ name: QuestionaryConfig.name, schema: QuestionaryConfigSchema }]), AuthenticationModule],
  providers: [...resolvers, ...services],
  exports: [QuestionaryConfigManager],
})
export class QuestionaryConfigurationModule {}
