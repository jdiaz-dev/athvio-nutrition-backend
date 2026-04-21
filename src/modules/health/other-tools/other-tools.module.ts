import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { OtherTool, OtherToolSchema } from 'src/modules/health/other-tools/adapters/out/other-tool.schema';
import { OtherToolsResolver } from 'src/modules/health/other-tools/adapters/in/other-tools.resolver';
import { OtherToolsPersistenceService } from 'src/modules/health/other-tools/adapters/out/other-tool-persistence.service';
import { OtherToolsManagerService } from 'src/modules/health/other-tools/application/other-tools-manager.service';

const resolvers = [OtherToolsResolver];
const persistenceServices = [OtherToolsPersistenceService];
const applicationServices = [OtherToolsManagerService];

@Module({
  imports: [MongooseModule.forFeature([{ name: OtherTool.name, schema: OtherToolSchema }]), forwardRef(() => AuthModule)],
  providers: [...resolvers, ...persistenceServices, ...applicationServices],
})
export class OtherToolsModule {}
