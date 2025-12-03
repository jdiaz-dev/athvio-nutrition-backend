import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { InternalPaymentStatus } from 'src/modules/professionals/payments/helpers/payment-constants';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';

@Schema({ timestamps: true, collection: 'Payments' })
export class Payment extends BaseSchema {
  @Prop({ type: String, required: true })
  professional!: string;

  @Prop({ type: String, required: false })
  external_id?: string;

  @Prop({ type: String, enum: InternalPaymentStatus, required: true })
  status!: InternalPaymentStatus;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.methods.toJSON = function (): Partial<Payment> {
  const { __v, createdAt, updatedAt, ...rest } = this.toObject();
  return rest as Partial<Payment>;
};
