import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({ message: 'Booking Platform API — use /api/health to check status' });
});

export default app;
