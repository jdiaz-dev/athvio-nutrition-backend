import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Payment, PaymentDocument } from 'src/modules/professionals/payments/adapters/out/payment.schema';
import { PaymentWithStatus } from 'src/modules/professionals/payments/helpers/payment';

import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { Trazability } from 'src/shared/types';

@Injectable()
export class PaymentsPersistenceService extends MongodbQueryBuilder<PaymentDocument> {
  constructor(
    @InjectModel(Payment.name) protected readonly paymentModel: Model<PaymentDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(paymentModel, logger, Payment.name, als);
  }

  async createPayment({ professional, ...rest }: Omit<Payment, '_id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const paymentRes = await this.initializeQuery(this.createPayment.name).create({
      professional,
      ...rest,
    });

    return paymentRes;
  }
  async getPayment(payment: string): Promise<Payment> {
    const paymentRes = await this.initializeQuery(this.getPayment.name).findOne({
      uuid: payment,
    });

    return paymentRes;
  }
  async updatePaymentStatus({ uuid, ...rest }: PaymentWithStatus): Promise<Payment> {
    const paymentRes = await this.initializeQuery(this.updatePaymentStatus.name).findOneAndUpdate(
      {
        uuid,
      },
      {
        ...rest,
      },
      { new: true },
    );

    return paymentRes;
  }
}
