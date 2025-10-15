import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  VerificationPaymentResponse,
  VerifyPaymentDto,
} from 'src/modules/professionals/payments/adapters/in/dtos/verify-payment.dto';
import { VerificatorPaymentService } from 'src/modules/professionals/payments/application/verificator-payment.service';

@Resolver()
export class PaymentsResolver {
  constructor(protected readonly vps: VerificatorPaymentService) {}

  @Mutation(() => VerificationPaymentResponse)
  async verifyPayment(@Args('input') dto: VerifyPaymentDto): Promise<VerificationPaymentResponse> {
    return this.vps.verifyPayment(dto.externalId);
    // const result = await polar.checkouts.get({ id: 'd15684dc-53b7-4eab-b580-59639c5a6d0f' }); //stayed here
  }
}
