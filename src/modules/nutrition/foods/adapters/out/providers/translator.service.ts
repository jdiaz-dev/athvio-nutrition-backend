import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorTransaltorProvider } from 'src/shared/enums/messages-response';
import * as deepl from 'deepl-node';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class TranslatorService {
  private readonly authKey: string;
  private readonly translator: deepl.Translator;
  constructor(private readonly configService: ConfigService, private readonly logger: AthvioLoggerService) {
    this.authKey = this.configService.get<string>('translationProvider.deeplAuthKey');
    this.translator = new deepl.Translator(this.authKey);
  }

  async translate(body: { words: string[]; source: 'en' | 'es'; target: 'en-US' | 'es' }): Promise<string[]> {
    try {
      const result = await this.translator.translateText(body.words, body.source, body.target, { context: 'food' });
      return result.map((item) => item.text);
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(ErrorTransaltorProvider.TRANSLATE);
    }
  }
}
