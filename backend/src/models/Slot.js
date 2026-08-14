import { query } from '../config/db.js';

function mapSlot(row) {
  if (!row) return null;
  return {
    id: row.id,
    providerId: row.providerId ?? row.provider_id,
    serviceId: row.serviceId ?? row.service_id,
    startsAt: row.startsAt ?? row.starts_at,
    endsAt: row.endsAt ?? row.ends_at,
    status: row.status,
    createdAt: row.createdAt ?? row.created_at,
  };
}

const PUBLIC_FIELDS = `
  id, provider_id AS "providerId", service_id AS "serviceId",
  starts_at AS "startsAt", ends_at AS "endsAt", status, created_at AS "createdAt"
`;

export async function createSlot({ providerId, serviceId, startsAt, endsAt }) {
  const result = await query(
    `INSERT INTO availability_slots (provider_id, service_id, starts_at, ends_at)
     VALUES ($1, $2, $3, $4)
     RETURNING ${PUBLIC_FIELDS}`,
    [providerId, serviceId ?? null, startsAt, endsAt]
  );
  return mapSlot(result.rows[0]);
}

export async function findSlotsByProvider(providerId) {
  const result = await query(
    `SELECT ${PUBLIC_FIELDS} FROM availability_slots
     WHERE provider_id = $1 ORDER BY starts_at ASC`,
    [providerId]
  );
  return result.rows.map(mapSlot);
}

export async function findOpenSlotsByService(serviceId) {
  const result = await query(
    `SELECT ${PUBLIC_FIELDS} FROM availability_slots
     WHERE service_id = $1 AND status = 'open' AND starts_at > NOW()
     ORDER BY starts_at ASC`,
    [serviceId]
  );
  return result.rows.map(mapSlot);
}

export async function findSlotById(id) {
  const result = await query(
    `SELECT ${PUBLIC_FIELDS} FROM availability_slots WHERE id = $1`,
    [id]
  );
  return mapSlot(result.rows[0]);
}

export default { createSlot, findSlotsByProvider, findOpenSlotsByService, findSlotById };