import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import destinationRoutes from './routes/destination.routes.js';
import tripRoutes from './routes/trip.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve avatar static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/activities', destinationRoutes);
app.use('/api/v1/search', destinationRoutes);
app.use('/api/v1/trips', tripRoutes);

// Health check endpoint
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

export default app;