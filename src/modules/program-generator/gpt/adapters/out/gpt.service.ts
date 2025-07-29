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
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AthvioLoggerService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('gptProvider.gptSecretKey'),
    });
  }

  /* 
  

  You are a assistant expert nutritionist. You must help to another nutritionist to threat their patients
  The patient have this diseases : cancer, diabetes,
  the root cause of the previous diseases are caused by : parasites, fungi
  when the nutritionist request a nutritional you must to accomplish with every instruction closed in triple quotes 

  - """the patient need  one nutritiona plan for 7 days"""
  - """the nutritional plan is for 1800 calories every day"""
  - """every day must contain 3 meals""" 
  - """the nutritional plan must contain this indications: must contain carrot juice all days, must contain cabbage juice all days, must include 20 ml of castor oil all days, all the nutritional plan must be a vegan diet """
  */
  async chatCompletion<T>(prompt: string, schemaPrompt: ZodType<T>): Promise<T> {
    prompt;
    try {
      const res = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
              - Eres un asistente experto en nutrición. Debes ayudar a otro nutricionista a evaluar a sus pacientes.
              - El paciente padece estas enfermedades: cáncer, diabetes.
              - La causa raiz de las enfermedades mencionadas es: parásitos, hongos.
              - Cuando el nutricionista te solicite un plan nutricional, debes seguir todas las instrucciones entre comillas triples.
            `,
          },
          {
            role: 'user',
            content: prompt,

            /* `
            """generate nutritional plan for 7 days"""."""the nutritional plan is for 1800 calories every day"""."""every day must contain 3 meals"""."""the nutritional plan must contain this indications: must contain carrot juice all days, must contain cabbage juice all days, must include 20 ml of castor oil all days, all the nutritional plan must be a vegan diet """
            `, */
          },
        ],
        model: 'gpt-4o',
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
