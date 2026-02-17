import { Worker } from 'worker_threads';
import Fastify from 'fastify';
import * as path from 'path';

interface WorkerStatus {
  status: 'starting' | 'running' | 'stopped' | 'error';
  uptime: number;
  lastError?: string;
  restartCount: number;
  pid?: number;
}

class WorkerManager {
  private worker: Worker | null = null;
  private workerStatus: WorkerStatus = {
    status: 'stopped',
    uptime: 0,
    restartCount: 0,
  };
  private startTime: number = 0;
  private maxRestarts = 5;
  private restartWindow = 60000; // 1 minute
  private restartHistory: number[] = [];

  constructor(
    private workerPath: string,
    private isDev: boolean = false,
  ) {}

  start(): void {
    if (this.worker) {
      console.log('Worker already running');
      return;
    }

    // Check restart rate limiting
    if (!this.canRestart()) {
      console.error('Too many restarts in short time. Manual intervention required.');
      this.workerStatus.status = 'error';
      this.workerStatus.lastError = 'Restart limit exceeded';
      return;
    }

    console.log('Starting worker thread...');
    this.workerStatus.status = 'starting';
    this.startTime = Date.now();

    // Configure worker options based on environment
    const workerOptions: any = {};

    if (this.isDev) {
      // In development, use ts-node to run TypeScript files
      workerOptions.execArgv = ['--require', 'ts-node/register'];
    }

    this.worker = new Worker(this.workerPath, workerOptions);

    this.worker.on('message', (message) => {
      console.log('[Worker Message]:', message);
      if (message.type === 'ready') {
        this.workerStatus.status = 'running';
        console.log('Worker thread is ready and running');
      }
    });

    this.worker.on('error', (error) => {
      console.error('[Worker Error]:', error);
      this.workerStatus.status = 'error';
      this.workerStatus.lastError = error.message;
    });

    this.worker.on('exit', (code) => {
      console.log(`Worker exited with code ${code}`);
      this.workerStatus.status = 'stopped';
      this.worker = null;

      if (code !== 0) {
        console.log('Worker crashed. Attempting restart...');
        this.workerStatus.restartCount++;
        this.restartHistory.push(Date.now());
        setTimeout(() => this.start(), 2000); // Restart after 2 seconds
      }
    });
  }

  stop(): void {
    if (this.worker) {
      console.log('Stopping worker thread...');
      this.worker.postMessage({ type: 'shutdown' });
      this.worker.terminate();
      this.worker = null;
      this.workerStatus.status = 'stopped';
    }
  }

  getStatus(): WorkerStatus {
    if (this.workerStatus.status === 'running' && this.startTime) {
      this.workerStatus.uptime = Date.now() - this.startTime;
    }
    return { ...this.workerStatus };
  }

  restart(): void {
    console.log('Restarting worker...');
    this.stop();
    setTimeout(() => this.start(), 1000);
  }

  private canRestart(): boolean {
    const now = Date.now();
    // Remove old restart timestamps outside the window
    this.restartHistory = this.restartHistory.filter((timestamp) => now - timestamp < this.restartWindow);

    return this.restartHistory.length < this.maxRestarts;
  }
}

async function startMonitorServer(workerManager: WorkerManager): Promise<void> {
  const server = Fastify({
    logger: true,
  });

  // Health check endpoint for the worker
  server.get('/health/worker', async (_request, reply) => {
    const status = workerManager.getStatus();
    const isHealthy = status.status === 'running';

    reply.code(isHealthy ? 200 : 503).send({
      healthy: isHealthy,
      worker: status,
      timestamp: new Date().toISOString(),
    });
  });

  // Main thread health check
  server.get('/health', async (_request, reply) => {
    reply.send({
      status: 'ok',
      mainThread: 'running',
      timestamp: new Date().toISOString(),
    });
  });

  // Restart worker endpoint
  server.post('/worker/restart', async (_request, reply) => {
    workerManager.restart();
    reply.send({
      message: 'Worker restart initiated',
      timestamp: new Date().toISOString(),
    });
  });

  // Detailed status endpoint
  server.get('/status', async (_request, reply) => {
    const status = workerManager.getStatus();
    reply.send({
      mainThread: {
        status: 'running',
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
      workerThread: status,
      timestamp: new Date().toISOString(),
    });
  });

  const port = process.env.MONITOR_PORT || 3001;

  try {
    await server.listen({ port: Number(port), host: '0.0.0.0' });
    console.log(`Monitor server running on port ${port}`);
    console.log(`- Health check: http://localhost:${port}/health`);
    console.log(`- Worker status: http://localhost:${port}/health/worker`);
    console.log(`- Detailed status: http://localhost:${port}/status`);
  } catch (err) {
    console.error('Error starting monitor server:', err);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  console.log('Starting main thread...');

  // Determine if we're in development or production
  const isDev = process.env.NODE_ENV !== 'production' && __filename.endsWith('.ts');

  // Use .ts for development, .js for production
  const workerFile = isDev ? 'worker.ts' : 'worker.js';
  const workerPath = path.join(__dirname, workerFile);

  console.log(`Loading worker from: ${workerPath}`);
  console.log(`Mode: ${isDev ? 'development' : 'production'}`);

  const workerManager = new WorkerManager(workerPath, isDev);

  // Start monitoring server
  await startMonitorServer(workerManager);

  // Start worker thread
  workerManager.start();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    workerManager.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    workerManager.stop();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Fatal error in main thread:', error);
  process.exit(1);
});
