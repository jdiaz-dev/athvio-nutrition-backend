import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AthvioLoggerService {
  constructor(private readonly logger: Logger) {}

  error({ layer, error }: { layer: string; error: unknown }): void {
    this.logger.error({ layer, error });
  }
}
