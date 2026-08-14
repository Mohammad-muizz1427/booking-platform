import bcrypt from 'bcrypt';
import { query } from '../config/db.js';

const SALT_ROUNDS = 12;

const PUBLIC_FIELDS =
  'id, email, full_name AS "fullName", role, is_active AS "isActive", created_at AS "createdAt"';

function mapUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName ?? row.full_name,
    role: row.role,
    isActive: row.isActive ?? row.is_active,
    createdAt: row.createdAt ?? row.created_at,
  };
}

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

export async function findByEmail(email) {
  const result = await query(
    `SELECT id, email, password_hash, full_name, role, is_active, created_at
     FROM users
     WHERE email = lower($1)`,
    [email]
  );

  return result.rows[0] ?? null;
}

export async function findById(id) {
  const result = await query(
    `SELECT ${PUBLIC_FIELDS}
     FROM users
     WHERE id = $1`,
    [id]
  );

  return mapUser(result.rows[0]);
}

export async function createUser({ email, password, fullName, role }) {
  const passwordHash = await hashPassword(password);

  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES (lower($1), $2, $3, $4)
     RETURNING ${PUBLIC_FIELDS}`,
    [email, passwordHash, fullName, role]
  );

  return mapUser(result.rows[0]);
}

export default {
  hashPassword,
  comparePassword,
  findByEmail,
  findById,
  createUser,
};
