import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {
  @Get('ping')
  findAll(): string {
    return 'pong';
  }
}
