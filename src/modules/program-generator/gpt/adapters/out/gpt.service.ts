import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  private openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('gptProvider.gptSecretKey'),
    });
  }
  async chatCompletion(prompt: string): Promise<any> {
    try {
      const res = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
      });

      const resParsed = JSON.parse(res.choices[0].message.content);
      return resParsed;
    } catch (error) {
      console.log('-------error', error);
    }
  }
}
