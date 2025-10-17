export enum InternalPaymentStatus {
  PENDING = 'pending',
  SUCCEDED = 'succeded',
}

export enum PaymentProcessorError {
  PAYMENT_LINK_CREATION_FAILED = 'Failed to create payment link',
  PROCESSED_PAYMENT_NOT_FOUND = 'Processed payment not found',
}
