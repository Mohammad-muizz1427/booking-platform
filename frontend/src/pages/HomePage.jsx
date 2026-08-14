import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function HomePage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Health check failed');
        }

        setHealth(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
  }, []);

  return (
    <section className="hero">
      <h1>Book services with confidence</h1>
      <p className="subtitle">
        Browse offerings from service providers, pick an open slot, and manage
        bookings in one place.
      </p>

      <div className="status-card">
        <h2>System status</h2>

        {loading && <p className="muted">Checking API and database…</p>}

        {error && (
          <p className="error">
            Could not reach the backend: {error}. Make sure the server is running
            on port 5000 and <code>backend/.env</code> has a valid Supabase{' '}
            <code>DATABASE_URL</code>.
          </p>
        )}

        {health && (
          <dl className="status-grid">
            <div>
              <dt>API</dt>
              <dd className={health.status === 'ok' ? 'ok' : 'warn'}>
                {health.status}
              </dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd className={health.database === 'connected' ? 'ok' : 'warn'}>
                {health.database}
              </dd>
            </div>
            {health.serverTime && (
              <div>
                <dt>Server time</dt>
                <dd>{new Date(health.serverTime).toLocaleString()}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </section>
  );
}
