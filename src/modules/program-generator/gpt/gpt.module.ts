import { Module } from '@nestjs/common';
import { GptService } from 'src/modules/program-generator/gpt/adapters/out/gpt.service';

@Module({
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}
