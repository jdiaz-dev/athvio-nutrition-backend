import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PaymentsPersistenceService } from 'src/modules/professionals/payments/adapters/out/payments-persistence.service';
import { PaymentsProcessorService } from 'src/modules/professionals/payments/application/payments-processor.service';
import { InternalPaymentStatus } from 'src/modules/professionals/payments/helpers/payment-constants';

@Injectable()
export class CreatePaymentLinkService {
  constructor(
    private readonly pprs: PaymentsProcessorService,
    private readonly pps: PaymentsPersistenceService,
  ) {}

  async createPaymentLink(professional: string): Promise<string> {
    const payment = await this.pps.createPayment({ uuid: randomUUID(), professional, status: InternalPaymentStatus.PENDING });
    const paymentLink = await this.pprs.createPaymentLink({ reference_id: payment.uuid });
    const paymentLinkWithParam = `${paymentLink.url}?reference_id=${payment.uuid}`;
    return paymentLinkWithParam;
  }
}
