import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health and Status API Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'operational',
      kernel: 'OB/NBE Regulatory Reporting Kernel',
      role: 'Technical Landing Environment',
      service: 'Node.js Express Full-Stack Host',
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      readyForImport: true,
    });
  });

  // Development vs Production serving
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kernel] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[Kernel] Failed to initialize server:', error);
  process.exit(1);
});
