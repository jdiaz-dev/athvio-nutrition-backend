import { BadRequestException, HttpExceptionOptions } from '@nestjs/common';

export class CustomBadRequestException extends BadRequestException {
  constructor(objectOrError?: any, descriptionOrOptions?: string | HttpExceptionOptions) {
    super(objectOrError, descriptionOrOptions);
  }
}
