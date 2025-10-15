import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Payment } from 'src/modules/professionals/payments/adapters/out/payment.schema';
import { PaymentsPersistenceService } from 'src/modules/professionals/payments/adapters/out/payments-persistence.service';
import { PaymentWithStatus } from 'src/modules/professionals/payments/helpers/payment';
import { InternalPaymentStatus } from 'src/modules/professionals/payments/helpers/payment-constants';

@Injectable()
export class PaymentsManagerService {
  constructor(protected readonly pps: PaymentsPersistenceService) {}

  async createPendingPayment(professional: string): Promise<Payment> {
    return await this.pps.createPayment({ uuid: randomUUID(), professional, status: InternalPaymentStatus.PENDING });
  }
  async getPayment(payment: string): Promise<Payment> {
    const res = await this.pps.getPayment(payment);
    return res;
  }
  async updatePaymentStatus(payment: PaymentWithStatus): Promise<Payment> {
    const res = await this.pps.updatePaymentStatus(payment);
    return res;
  }
}
