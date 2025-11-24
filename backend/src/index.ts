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
import { errorHandler } from './middleware/error.middleware';
import { connectDatabase } from './config/database';

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
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
  const openApiDocument = yaml.load(fs.readFileSync(openApiPath, 'utf8'));
  
  // Serve Swagger UI at /api/docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, {
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
    } catch (error) {
      console.warn('PostgreSQL not available, continuing without database');
      console.warn('   Configure PostgreSQL credentials in .env file');
    }

    // Start server
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
      console.log(`   POST /api/quiz/:slug/submit`);
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
  process.exit(1);
});

// Start the server
startServer();

export default app;
