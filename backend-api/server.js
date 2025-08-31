import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import csvRoutes from './routes/dataVisualizerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { PrismaClient } from "./generated/prisma/index.js";
import { logger } from './middlewares/loggerMiddleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandlerMiddleware.js';

// Prisma 
const prisma = new PrismaClient();

// Constants
const port = process.env.PORT || 3001;

// Create http server
const app = express();

// CORS configuration for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger);

// API Routes
app.use("/api/csv", csvRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend API server is running' });
});

// Error handling middleware (must be registered after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

// Start http server
const server = app.listen(port, async () => {
  console.log(`Backend API Server started at http://localhost:${port}`);
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    console.log("Server is ready to accept connections");
  } catch (err) {
    console.error("Database connection error:", err);
  }
});

// Keep server alive
server.keepAliveTimeout = 5000;
server.headersTimeout = 6000;

// Prevent process from exiting
setInterval(() => {
  // Keep process alive
}, 30000);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});