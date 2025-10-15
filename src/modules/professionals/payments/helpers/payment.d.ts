import { Payment } from 'src/modules/professionals/payments/adapters/out/payment.schema';

export type PaymentWithStatus = Pick<Payment, 'uuid' | 'status' | 'external_id'>;
