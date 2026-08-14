import { testConnection } from '../config/db.js';

export async function getHealth(req, res) {
  try {
    const db = await testConnection();

    res.json({
      status: 'ok',
      message: 'Booking platform API is running',
      database: 'connected',
      serverTime: db.server_time,
    });
  } catch (error) {
    console.error('Health check failed:', error.message);

    res.status(503).json({
      status: 'degraded',
      message: 'API is running but database is unreachable',
      database: 'disconnected',
      error: error.message,
    });
  }
}
