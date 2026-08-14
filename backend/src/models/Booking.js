import { query } from '../config/db.js';

function mapBooking(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerId: row.customerId ?? row.customer_id,
    providerId: row.providerId ?? row.provider_id,
    serviceId: row.serviceId ?? row.service_id,
    slotId: row.slotId ?? row.slot_id,
    status: row.status,
    priceCents: row.priceCents ?? row.price_cents,
    startsAt: row.startsAt ?? row.starts_at,
    endsAt: row.endsAt ?? row.ends_at,
    bookedAt: row.bookedAt ?? row.booked_at,
  };
}

const PUBLIC_FIELDS = `
  id, customer_id AS "customerId", provider_id AS "providerId",
  service_id AS "serviceId", slot_id AS "slotId", status,
  price_cents AS "priceCents", starts_at AS "startsAt", ends_at AS "endsAt",
  booked_at AS "bookedAt"
`;

export async function createBooking({ customerId, providerId, serviceId, slotId, priceCents, durationMinutes, startsAt, endsAt }) {
  const result = await query(
    `INSERT INTO bookings (customer_id, provider_id, service_id, slot_id, price_cents, duration_minutes, starts_at, ends_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${PUBLIC_FIELDS}`,
    [customerId, providerId, serviceId, slotId, priceCents, durationMinutes, startsAt, endsAt]
  );
  return mapBooking(result.rows[0]);
}

export async function findBookingsByCustomer(customerId) {
  const result = await query(
    `SELECT ${PUBLIC_FIELDS} FROM bookings WHERE customer_id = $1 ORDER BY starts_at DESC`,
    [customerId]
  );
  return result.rows.map(mapBooking);
}

export async function findBookingsByProvider(providerId) {
  const result = await query(
    `SELECT ${PUBLIC_FIELDS} FROM bookings WHERE provider_id = $1 ORDER BY starts_at DESC`,
    [providerId]
  );
  return result.rows.map(mapBooking);
}

export async function findBookingById(id) {
  const result = await query(`SELECT ${PUBLIC_FIELDS} FROM bookings WHERE id = $1`, [id]);
  return mapBooking(result.rows[0]);
}

export async function updateBookingStatus(id, status, actorId, actorColumn) {
  const result = await query(
    `UPDATE bookings SET status = $2, updated_at = NOW()
     WHERE id = $1 AND ${actorColumn} = $3
     RETURNING ${PUBLIC_FIELDS}`,
    [id, status, actorId]
  );
  return mapBooking(result.rows[0]);
}

export async function markSlotBooked(slotId) {
  await query(`UPDATE availability_slots SET status = 'booked' WHERE id = $1`, [slotId]);
}

export async function markSlotOpen(slotId) {
  await query(`UPDATE availability_slots SET status = 'open' WHERE id = $1`, [slotId]);
}

export default {
  createBooking,
  findBookingsByCustomer,
  findBookingsByProvider,
  findBookingById,
  updateBookingStatus,
  markSlotBooked,
  markSlotOpen,
};