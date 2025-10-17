import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Polar, ServerList } from '@polar-sh/sdk';
import { Checkout } from '@polar-sh/sdk/dist/commonjs/models/components/checkout';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Trazability } from 'src/shared/types';
import { LayersServer } from 'src/shared/enums/project';
import { CheckoutLink } from '@polar-sh/sdk/dist/commonjs/models/components/checkoutlink';
import { PaymentProcessorError } from 'src/modules/professionals/payments/helpers/payment-constants';

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
        errorMessage: (error as Error).message,
        message: PaymentProcessorError.PROCESSED_PAYMENT_NOT_FOUND,
        stack: (error as Error).stack,
        error,
      });
      throw new InternalServerErrorException(PaymentProcessorError.PROCESSED_PAYMENT_NOT_FOUND);
    }
  }

  async createPaymentLink(metadata: { reference_id: string }): Promise<CheckoutLink> {
    const originUrl =
      process.env.NODE_ENV === 'production' ? process.env.ORIGIN_PRODUCTION_WEB_DOMAIN : process.env.ORIGIN_WEB_LOCAL;
    const urlWithParam = `${originUrl}/signin?checkout_id={CHECKOUT_ID}`;
    try {
      const res = await this.#processor.checkoutLinks.create({
        paymentProcessor: 'stripe',
        productId: process.env.POLAR_PRODUCT_ID,
        ...metadata,
        successUrl: urlWithParam,
      });
      return res;
    } catch (error) {
      this.logger.error({
        traceId: this.als.getStore().traceId,
        layer: LayersServer.APPLICATION,
        errorMessage: (error as Error).message,
        message: PaymentProcessorError.PAYMENT_LINK_CREATION_FAILED,
        stack: (error as Error).stack,
        error,
      });
      throw new InternalServerErrorException(PaymentProcessorError.PAYMENT_LINK_CREATION_FAILED);
    }
  }
}
