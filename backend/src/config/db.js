import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    'Warning: DATABASE_URL is not set. Copy backend/.env.example to backend/.env and add your Supabase connection string.'
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined,
});

pool.on('error', (err) => {
  console.error('Unexpected Postgres pool error', err);
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function testConnection() {
  const result = await pool.query('SELECT NOW() AS server_time');
  return result.rows[0];
}

export default pool;
