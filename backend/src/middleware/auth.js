import { verifyToken } from '../utils/jwt.js';
import { findById } from '../models/User.js';

const VALID_ROLES = new Set(['customer', 'provider']);

export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Token expired'
        : 'Invalid or malformed token';

    return res.status(401).json({ message });
  }
}

export function requireRole(...allowedRoles) {
  const invalidRole = allowedRoles.find((role) => !VALID_ROLES.has(role));

  if (invalidRole) {
    throw new Error(`Invalid role configured in requireRole: ${invalidRole}`);
  }

  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        message: 'You do not have permission to access this resource',
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
}

export async function attachUser(req, res, next) {
  try {
    const user = await findById(req.auth.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User account is inactive or not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
