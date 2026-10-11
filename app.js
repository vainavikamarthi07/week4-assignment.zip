import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';
import noteRoutes from './routes/notes.js';
import uploadRoutes from './routes/uploads.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map(value => value.trim()).filter(Boolean);
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && !allowedOrigins.includes(origin)) return res.status(403).json({ message: 'This website is not allowed to access the API.' });
  if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/uploads', express.static(path.resolve(here, '../uploads'), { index: false, maxAge: '1h' }));
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use((req, res) => res.status(404).json({ message: `No route for ${req.method} ${req.path}` }));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ message: 'That email is already registered.' });
  if (error.name === 'MulterError') return res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller.' : error.message });
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: error.message });
  if (error.message?.startsWith('Upload a JPG')) return res.status(400).json({ message: error.message });
  res.status(500).json({ message: 'Something went wrong on the server.' });
});
export default app;
