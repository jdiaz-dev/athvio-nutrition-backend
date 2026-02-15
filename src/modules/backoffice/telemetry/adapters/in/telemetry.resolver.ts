import { Query, Resolver } from '@nestjs/graphql';
import { cpuUsage } from 'node:process';
import { performance } from 'node:perf_hooks';

@Resolver()
export class TelemetryResolver {
  private previousELU = performance.eventLoopUtilization();
  private monitoringInterval: NodeJS.Timeout;
  private lastStoredELU: any = null;

  constructor() {
    this.startELUMonitoring();
  }

  private startELUMonitoring() {
    this.monitoringInterval = setInterval(() => {
      const currentELU = performance.eventLoopUtilization();
      const diff = performance.eventLoopUtilization(currentELU, this.previousELU);

      const eluData = {
        timestamp: new Date().toISOString(),
        idle: diff.idle.toFixed(4),
        activeTime: diff.active.toFixed(4),
        utilization: diff.utilization.toFixed(4),
        utilizationPercent: (diff.utilization * 100).toFixed(2) + '%',
      };

      // console.log('ELU Metrics:', JSON.stringify(eluData));
      this.lastStoredELU = eluData;
      this.previousELU = currentELU;
    }, 5000);
  }

  @Query(() => String)
  getCpuUsage(): String {
    const cpu_usage = cpuUsage();
    return JSON.stringify(cpu_usage);
  }

  @Query(() => String)
  getMemoryUsage(): String {
    const memory_usage = process.memoryUsage();
    return JSON.stringify(memory_usage);
  }

  @Query(() => String)
  getELU(): String {
    // Return the last monitored result
    if (this.lastStoredELU) {
      return JSON.stringify(this.lastStoredELU);
    } else {
      return JSON.stringify({
        message: 'No ELU data available yet. Please wait for the first monitoring cycle (5 seconds).',
      });
    }
  }

  onModuleDestroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}
