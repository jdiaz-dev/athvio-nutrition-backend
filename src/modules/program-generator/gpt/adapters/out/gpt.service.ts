import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ZodType } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

@Injectable()
export class GptService {
  private openai: OpenAI;
  constructor(private readonly configService: ConfigService, private readonly logger: AthvioLoggerService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('gptProvider.gptSecretKey'),
    });
  }
  async chatCompletion<T>(prompt: string, schemaPrompt: ZodType<T>): Promise<T> {
    try {
      const res = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a nutritionist.' },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-4o-mini',
        response_format: zodResponseFormat(schemaPrompt, 'nutri_response'),
      });

      const resParsed = JSON.parse(res.choices[0].message.content);
      return resParsed as T;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(InternalErrors.IA_PROVIDER);
    }
  }
}
