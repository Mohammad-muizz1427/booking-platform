import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
}));

app.use(express.json());

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({ message: 'Booking Platform API — use /api/health to check status' });
});

export default app;