import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AthvioLoggerService {
  constructor(
    @InjectPinoLogger(AthvioLoggerService.name)
    private readonly logger: PinoLogger,
  ) {}

  error(error: unknown): void {
    this.logger.error(error);
  }
  warn(error: unknown): void {
    this.logger.error(error);
  }
  info(info: unknown) {
    this.logger.info(info);
  }
}
