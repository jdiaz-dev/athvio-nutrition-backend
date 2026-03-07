import { Worker, MessageChannel } from 'worker_threads';
import * as http from 'http';
import * as path from 'path';
import { monitorEventLoopDelay, performance } from 'perf_hooks';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ELUStats {
  utilization: number; // % 0–100
  lagMean_ms: number;
  lagMax_ms: number;
  lagP99_ms: number;
}

interface WorkerTelemetry {
  elu: ELUStats;
  uptime: number;
  memoryUsage: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  timestamp: string;
}

interface WorkerStats {
  status: 'starting' | 'ready' | 'error';
  port?: string;
  startedAt?: string;
  lastUpdated?: string;
  error?: string;
}

interface ResourceSnapshot {
  timestamp: string;
  workerStatus: WorkerStats['status'];
  pingLatency_ms: number | null;
  workerELU: ELUStats | null;
  mainThreadELU: ELUStats;
}

// ── WorkerMonitor class ───────────────────────────────────────────────────────

class WorkerMonitor {
  // ── State ───────────────────────────────────────────────────────────────────

  private readonly HISTORY_WINDOW_MS = 5_000;
  private readonly POLL_INTERVAL_MS = 1_000;
  private readonly MONITOR_PORT: number;

  private snapshotHistory: ResourceSnapshot[] = [];
  private currentStats: WorkerStats = { status: 'starting' };
  private latestWorkerTelemetry: WorkerTelemetry | null = null;

  private worker: Worker | null = null;

  constructor() {
    this.MONITOR_PORT = Number(process.env.MONITOR_PORT) || 9000;
  }

  // ── Entry point ─────────────────────────────────────────────────────────────

  start(): void {
    this.worker = this.startWorker();
    this.startMonitoring(this.worker);
    this.startMonitoringServer();
  }

  // ── Snapshot history ────────────────────────────────────────────────────────

  private recordSnapshot(snap: ResourceSnapshot): void {
    this.snapshotHistory.push(snap);
    const cutoff = Date.now() - this.HISTORY_WINDOW_MS;
    while (
      this.snapshotHistory.length > 0 &&
      new Date(this.snapshotHistory[0].timestamp).getTime() < cutoff
    ) {
      this.snapshotHistory.shift();
    }
  }

  // ── Worker ──────────────────────────────────────────────────────────────────

  private startWorker(): Worker {
    const workerPath = path.resolve(__dirname, 'worker.js');

    // Dedicated telemetry channel — main owns port1, worker owns port2
    const { port1: telemetryPort1, port2: telemetryPort2 } = new MessageChannel();

    const worker = new Worker(workerPath, {
      workerData: { telemetryPort: telemetryPort2 },
      transferList: [telemetryPort2], // transfers ownership to worker
    });

    // Receive ELU telemetry pushed by the worker every second
    telemetryPort1.on('message', (msg: WorkerTelemetry) => {
      this.latestWorkerTelemetry = msg;
    });

    worker.on('message', (msg: Partial<WorkerStats> & { status: string }) => {
      Object.assign(this.currentStats, msg, { lastUpdated: new Date().toISOString() });
      if (msg.status === 'ready') {
        console.log(`[Main] Worker is running successfully on port ${msg.port}`);
      }
    });

    worker.on('error', (err) => {
      console.error('[Main] Worker error:', err);
      this.currentStats = { status: 'error', error: err.message };
    });

    worker.on('exit', (code) => {
      console.warn(`[Main] Worker exited with code ${code}`);
      this.currentStats = { status: 'error', error: `Worker exited with code ${code}` };
    });

    return worker;
  }

  // ── Ping worker to measure event loop responsiveness ────────────────────────

  private async pingWorker(worker: Worker, timeoutMs = 2_000): Promise<number | null> {
    return new Promise((resolve) => {
      const { port1, port2 } = new MessageChannel();
      const start = performance.now();

      const timer = setTimeout(() => {
        port1.close();
        port2.close();
        resolve(null);
      }, timeoutMs);

      port1.once('message', (message) => {
        console.log('-----------message', message);
        clearTimeout(timer);
        port1.close();
        resolve(parseFloat((performance.now() - start).toFixed(3)));
      });

      worker.postMessage({ __ping__: true, port: port2 }, [port2]);
    });
  }

  // ── Monitoring loop ──────────────────────────────────────────────────────────

  private startMonitoring(worker: Worker): void {
    const histogram = monitorEventLoopDelay({ resolution: 10 });
    histogram.enable();

    let lastELU = performance.eventLoopUtilization();

    setInterval(async () => {
      const pingLatency_ms = await this.pingWorker(worker);

      const currentELU = performance.eventLoopUtilization(lastELU);
      lastELU = performance.eventLoopUtilization();

      const snap: ResourceSnapshot = {
        timestamp: new Date().toISOString(),
        workerStatus: this.currentStats.status,
        pingLatency_ms,
        workerELU: this.latestWorkerTelemetry?.elu ?? null,
        mainThreadELU: {
          utilization: parseFloat((currentELU.utilization * 100).toFixed(2)),
          lagMean_ms: parseFloat((histogram.mean / 1e6).toFixed(3)),
          lagMax_ms: parseFloat((histogram.max / 1e6).toFixed(3)),
          lagP99_ms: parseFloat((histogram.percentile(99) / 1e6).toFixed(3)),
        },
      };

      histogram.reset();
      this.recordSnapshot(snap);
    }, this.POLL_INTERVAL_MS);
  }

  // ── HTTP monitoring server ───────────────────────────────────────────────────

  private getWindowReport() {
    const now = Date.now();
    return {
      windowMs: this.HISTORY_WINDOW_MS,
      windowStart: new Date(now - this.HISTORY_WINDOW_MS).toISOString(),
      windowEnd: new Date(now).toISOString(),
      snapshotCount: this.snapshotHistory.length,
      workerInfo: {
        ...this.currentStats,
        latestTelemetry: this.latestWorkerTelemetry,
      },
      snapshots: this.snapshotHistory,
    };
  }

  private startMonitoringServer(): void {
    const server = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/monitor') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.getWindowReport(), null, 2));
        return;
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found. Use GET /monitor' }));
    });

    server.listen(this.MONITOR_PORT, '0.0.0.0', () => {
      console.log(`[Main] Monitor → http://localhost:${this.MONITOR_PORT}/monitor`);
    });
  }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

const monitor = new WorkerMonitor();
monitor.start();