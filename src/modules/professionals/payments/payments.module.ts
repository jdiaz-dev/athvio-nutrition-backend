import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth/auth.module';

import { PaymentsResolver } from 'src/modules/professionals/payments/adapters/in/payments.resolver';
import { Payment, PaymentSchema } from 'src/modules/professionals/payments/adapters/out/payment.schema';
import { PaymentsPersistenceService } from 'src/modules/professionals/payments/adapters/out/payments-persistence.service';
import { CreatePaymentLinkService } from 'src/modules/professionals/payments/application/create-payment-link.service';
import { PaymentsManagerService } from 'src/modules/professionals/payments/application/payments-manager.service';
import { PaymentsProcessorService } from 'src/modules/professionals/payments/application/payments-processor.service';
import { VerificatorPaymentService } from 'src/modules/professionals/payments/application/verificator-payment.service';

const services = [
  PaymentsPersistenceService,
  PaymentsManagerService,
  PaymentsProcessorService,
  CreatePaymentLinkService,
  VerificatorPaymentService,
];
const resolvers = [PaymentsResolver];

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]), forwardRef(() => AuthModule)],
  providers: [...services, ...resolvers],
  exports: [CreatePaymentLinkService],
})
export class PaymentsModule {}
