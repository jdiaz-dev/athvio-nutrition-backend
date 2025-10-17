import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { VerificationPaymentResponse } from 'src/modules/professionals/payments/adapters/in/dtos/verify-payment.dto';
import { PaymentsManagerService } from 'src/modules/professionals/payments/application/payments-manager.service';
import { PaymentsProcessorService } from 'src/modules/professionals/payments/application/payments-processor.service';
import { InternalPaymentStatus } from 'src/modules/professionals/payments/helpers/payment-constants';
import { LayersServer } from 'src/shared/enums/project';
import { Trazability } from 'src/shared/types';

enum PaymentVerificiationError {
  PAYMENT_NOT_PROCESSED = 'This payment was not processed',
  PAYMENT_NOT_FOUND = 'This payment was not found',
}

@Injectable()
export class VerificatorPaymentService {
  constructor(
    private readonly logger: AthvioLoggerService,
    private readonly als: AsyncLocalStorage<Trazability>,
    private readonly pprs: PaymentsProcessorService,
    private readonly pms: PaymentsManagerService,
  ) {}

  async verifyPayment(payment: string): Promise<VerificationPaymentResponse> {
    const processedPayment = await this.pprs.getProcessedPayment(payment);
    if (processedPayment == null || !(processedPayment.metadata as any).reference_id) {
      this.logger.warn({
        traceId: this.als.getStore().traceId,
        layer: LayersServer.APPLICATION,
        message: PaymentVerificiationError.PAYMENT_NOT_PROCESSED,
        payment,
      });
      return { isSucceded: false };
    }

    const paymentRes = await this.pms.updatePaymentStatus({
      uuid: (processedPayment.metadata as any).reference_id,
      status: InternalPaymentStatus.SUCCEDED,
      external_id: payment,
    });
    if (!paymentRes) {
      this.logger.warn({
        traceId: this.als.getStore().traceId,
        layer: LayersServer.APPLICATION,
        message: PaymentVerificiationError.PAYMENT_NOT_FOUND,
        payment,
      });
      return { isSucceded: false };
    }

    return { isSucceded: true };
  }
}
