import { Module } from '@nestjs/common';
import { AIproviderService } from 'src/modules/program-generator/artificial-intelligence/adapters/out/ai-provider.service';

@Module({
  providers: [AIproviderService],
  exports: [AIproviderService],
})
export class AIproviderModule {}
