import { query } from '../config/db.js';

function mapService(row) {
  if (!row) return null;

  return {
    id: row.id,
    providerId: row.providerId ?? row.provider_id,
    name: row.name,
    description: row.description,
    durationMinutes: row.durationMinutes ?? row.duration_minutes,
    priceCents: row.priceCents ?? row.price_cents,
    isActive: row.isActive ?? row.is_active,
    createdAt: row.createdAt ?? row.created_at,
    updatedAt: row.updatedAt ?? row.updated_at,
  };
}

const PUBLIC_FIELDS = `
  id, provider_id AS "providerId", name, description,
  duration_minutes AS "durationMinutes", price_cents AS "priceCents",
  is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"
`;

export async function createService({ providerId, name, description, durationMinutes, priceCents }) {
  const result = await query(
    `INSERT INTO services (provider_id, name, description, duration_minutes, price_cents)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${PUBLIC_FIELDS}`,
    [providerId, name, description ?? null, durationMinutes, priceCents]
  );

  return mapService(result.rows[0]);
}

export async function findServicesByProvider(providerId) {
  const result = await query(
    `SELECT ${PUBLIC_FIELDS}
     FROM services
     WHERE provider_id = $1
     ORDER BY created_at DESC`,
    [providerId]
  );

  return result.rows.map(mapService);
}

export async function findServiceById(id) {
  const result = await query(
    `SELECT ${PUBLIC_FIELDS}
     FROM services
     WHERE id = $1`,
    [id]
  );

  return mapService(result.rows[0]);
}

export async function updateService(id, providerId, updates) {
  const { name, description, durationMinutes, priceCents, isActive } = updates;

  const result = await query(
    `UPDATE services
     SET name = COALESCE($3, name),
         description = COALESCE($4, description),
         duration_minutes = COALESCE($5, duration_minutes),
         price_cents = COALESCE($6, price_cents),
         is_active = COALESCE($7, is_active),
         updated_at = NOW()
     WHERE id = $1 AND provider_id = $2
     RETURNING ${PUBLIC_FIELDS}`,
    [id, providerId, name, description, durationMinutes, priceCents, isActive]
  );

  return mapService(result.rows[0]);
}

export async function deleteService(id, providerId) {
  const result = await query(
    `DELETE FROM services WHERE id = $1 AND provider_id = $2 RETURNING id`,
    [id, providerId]
  );

  return result.rows[0] ?? null;
}

export default {
  createService,
  findServicesByProvider,
  findServiceById,
  updateService,
  deleteService,
};