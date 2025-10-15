import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';
import { Polar, ServerList } from '@polar-sh/sdk';
import { Checkout } from '@polar-sh/sdk/dist/commonjs/models/components/checkout';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Trazability } from 'src/shared/types';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class PaymentsProcessorService {
  #processor: Polar;
  constructor(
    private readonly logger: AthvioLoggerService,
    private readonly als: AsyncLocalStorage<Trazability>,
  ) {
    this.#processor = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: process.env.POLAR_SERVER as keyof typeof ServerList,
    });
  }

  async getProcessedPayment(checkout: string): Promise<Checkout | null> {
    try {
      const res = await this.#processor.checkouts.get({ id: checkout });
      return res;
    } catch (error) {
      this.logger.error({
        traceId: this.als.getStore().traceId,
        layer: LayersServer.APPLICATION,
        message: (error as Error).message,
        stack: (error as Error).stack,
        error,
      });
      return null;
    }
  }
}
