import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import quizRoutes from './routes/quiz.routes';
import adminRoutes from './routes/admin.routes';
import analyticsRoutes from './routes/analytics.routes';
import colonyRoutes from './routes/colony.routes';
import userRoutes from './routes/user.routes';
import shareRoutes from './routes/share.routes';
import seoRoutes from './routes/seo.routes';
import integrationRoutes from './routes/integration.routes';
import cacheRoutes from './routes/cache.routes';
import internalRoutes from './routes/internal.routes';
import adsRoutes from './routes/ads.routes';
import { errorHandler } from './middleware/error.middleware';
import { connectDatabase, warmupDatabase } from './config/database';
import { getRedis, closeRedis } from './config/redis';
import net from 'net';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ================================
// Middleware
// ================================

// Security headers
app.use(helmet());

// CORS configuration
// In development include the Vite dev server origin so the admin UI can send Authorization headers
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
};
app.use(cors(corsOptions));

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Response compression
app.use(compression());

// Serve uploaded files (for local development)
app.use('/uploads', express.static('uploads'));

// ================================
// Swagger/OpenAPI Documentation
// ================================

try {
  // Load OpenAPI spec from YAML file
  const openApiPath = path.join(__dirname, '../../docs/api/openapi.yaml');
  const openApiDocument = yaml.load(fs.readFileSync(openApiPath, 'utf8')) as Record<string, unknown>;
  
  // Serve Swagger UI at /api/docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument as swaggerUi.JsonObject, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'QuizBuzz API Documentation',
  }));
  
  console.log('Swagger UI loaded at /api/docs');
} catch (error) {
  console.warn('Swagger UI setup failed:', error);
}

// ================================
// Routes
// ================================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'QuizBuzz API',
    version: '1.0.0',
  });
});

// API routes
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/colony', colonyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/cache', cacheRoutes);
app.use('/internal', internalRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'QuizBuzz API',
    description: 'BuzzFeed-style Quiz Engine for Yelling Ant',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      quiz: '/api/quiz',
      admin: '/api/admin',
      docs: '/api/docs',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// ================================
// Server Initialization
// ================================

const startServer = async () => {
  try {
    // Connect to PostgreSQL database
    try {
      await connectDatabase();
      console.log('PostgreSQL connected successfully');
      
      // Warmup database to avoid cold start delays on first request
      await warmupDatabase();
      
      // Pre-warm the ads table specifically (commonly accessed)
      try {
        const { query } = await import('./config/database');
        await query('SELECT COUNT(*) FROM ads');
        console.log('Ads table pre-warmed');
        
        // Set up periodic keepalive to prevent Neon cold starts (every 4 minutes)
        setInterval(async () => {
          try {
            await query('SELECT 1');
          } catch (e) {
            console.warn('Database keepalive failed:', e);
          }
        }, 4 * 60 * 1000);
        console.log('Database keepalive scheduled (every 4 minutes)');
      } catch (e) {
        console.warn('Ads table warmup skipped');
      }
    } catch (error) {
      console.warn('PostgreSQL not available, continuing without database');
      console.warn('   Configure PostgreSQL credentials in .env file');
    }

    // Start server
    // Initialize Redis client (if configured). Allow disabling Redis for local dev
    const shouldAttemptRedis = process.env.DISABLE_REDIS !== 'true';
    if (shouldAttemptRedis) {
      // quick TCP probe to avoid creating ioredis when no server is listening
      const redisUrl = process.env.REDIS_URL || '127.0.0.1:6379';
      const [host, portStr] = redisUrl.replace('redis://', '').split(':');
      const port = Number(portStr) || 6379;
      const probe = () => new Promise<boolean>((resolve) => {
        const socket = new net.Socket();
        let resolved = false;
        socket.setTimeout(400);
        socket.on('connect', () => { resolved = true; socket.destroy(); resolve(true); });
        socket.on('timeout', () => { if (!resolved) { resolved = true; socket.destroy(); resolve(false); } });
        socket.on('error', () => { if (!resolved) { resolved = true; socket.destroy(); resolve(false); } });
        socket.connect(port, host);
      });

      try {
        const ok = await probe();
        if (ok) {
          try { getRedis(); } catch (e) { console.warn('Redis init failed:', e); }
        } else {
          console.log('Redis not reachable at', `${host}:${port} — skipping Redis client`);
        }
      } catch (e) {
        console.warn('Redis probe failed, skipping Redis client', e);
      }
    } else {
      console.log('Redis disabled via DISABLE_REDIS env var');
    }

    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════╗');
      console.log('║   QuizBuzz API Server Started          ║');
      console.log('╚════════════════════════════════════════╝');
      console.log('');
      console.log(`Server running on: http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: PostgreSQL`);
      console.log('');
      console.log('Available endpoints:');
      console.log(`   GET  /health`);
      console.log(`   GET  /api/quiz`);
      console.log(`   GET  /api/quiz/:slug`);
      console.log(`   GET  /api/quiz/:slug/related`);
      console.log(`   POST /api/quiz/:slug/submit`);
      console.log(`   POST /api/analytics/track`);
      console.log(`   GET  /api/admin/quiz`);
      console.log(`   POST /api/admin/quiz`);
      console.log(`   PUT  /api/admin/quiz/:slug`);
      console.log(`   DELETE /api/admin/quiz/:slug`);
      console.log(`   PATCH /api/admin/quiz/:slug/publish`);
      console.log(`   POST /api/admin/quiz/:slug/schedule`);
      console.log(`   GET  /api/admin/analytics/:slug`);
      console.log(`   POST /api/admin/upload`);
      console.log(`   GET  /api/admin/images`);
      console.log('');
      console.log('API Documentation:');
      console.log(`   http://localhost:${PORT}/api/docs`);
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't kill the process in development for a single unhandled rejection.
  // Keep the server running so endpoints remain available. In production,
  // consider letting the process exit so a supervisor can restart it.
});

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  try {
    await closeRedis();
  } catch (e) {
    console.warn('Error closing Redis', e);
  }
  process.exit(0);
});

// Start the server
startServer();

export default app;
