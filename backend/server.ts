import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import toolRoutes from './routes/toolRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const defaultDevOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const configuredOrigins = [
  ...(process.env.NEXT_FRONTEND_URLS || '').split(','),
  process.env.NEXT_FRONTEND_URL || '',
]
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultDevOrigins, ...configuredOrigins])];

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., curl/Postman) without Origin header
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(bodyParser.json());

// Serve uploaded images
app.use('/uploads',express.static(path.join(__dirname, '../uploads')));
// Home route for GET /
app.get('/', (req, res) => {
  res.send('API is running');
});

// Mount your routes
app.use('/api/tools', toolRoutes);
app.use('/api/users', userRoutes);
app.use('/api', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});
