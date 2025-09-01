import { Mutation, Resolver } from '@nestjs/graphql';
import { cpuUsage } from 'node:process';

@Resolver()
export class TelemetryResolver {
  @Mutation(() => String)
  getCpuUsage(): String {
    const cpu_usage = cpuUsage();
    cpu_usage;
    return 'receivedd';
  }
}
