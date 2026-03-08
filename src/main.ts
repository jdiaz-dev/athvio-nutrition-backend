import { Worker, MessageChannel } from 'worker_threads';
import * as http from 'http';
import * as path from 'path';

class MainServer {
  private readonly MONITOR_PORT: number;
  private worker: Worker | null = null;

  constructor() {
    this.MONITOR_PORT = Number(process.env.MONITOR_PORT) || 9000;
  }

  start(): void {
    this.worker = this.startWorkerApp();
    this.runServer();
  }

  private startWorkerApp(): Worker {
    const workerPath = path.resolve(__dirname, 'worker.js');
    const { port2: telemetryPort2 } = new MessageChannel();

    const worker = new Worker(workerPath, {
      workerData: { telemetryPort: telemetryPort2 },
      transferList: [telemetryPort2],
    });
    worker.on('message', (msg) => {
      console.log(`[Main] Worker server is running successfully on port ${msg.port}`);
    });

    worker.on('error', (err) => {
      console.error('[Main] Worker error:', err);
    });

    worker.on('exit', (code) => {
      console.warn(`[Main] Worker exited with code ${code}`);
    });
    return worker;
  }

  private pingWorkerApp() {
    return new Promise((resolve) => {
      const { port1, port2 } = new MessageChannel();

      port1.once('message', (message) => {
        port1.close();
        resolve(message);
      });

      this.worker.postMessage({ __ping__: true, port: port2 }, [port2]);
    });
  }

  private runServer(): void {
    const server = http.createServer(async (req, res) => {
      if (req.method === 'GET' && req.url === '/worker-monitor') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(await this.pingWorkerApp(), null, 2));
        return;
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found. Use GET /monitor' }));
    });

    server.listen(this.MONITOR_PORT, '0.0.0.0', () => {
      console.log(`[Main] http://localhost:${this.MONITOR_PORT}/worker-monitor running successfully`);
    });
  }
}

const server = new MainServer();
server.start();
