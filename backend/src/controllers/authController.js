import { signToken } from '../utils/jwt.js';
import * as User from '../models/User.js';

const VALID_ROLES = new Set(['customer', 'provider']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials({ email, password, fullName, role }) {
  if (!email || !password) {
    return 'Email and password are required';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'A valid email address is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (fullName !== undefined && fullName.trim().length === 0) {
    return 'Full name cannot be empty';
  }

  if (role !== undefined && !VALID_ROLES.has(role)) {
    return 'Role must be either customer or provider';
  }

  return null;
}

function issueAuthResponse(res, user, statusCode = 200) {
  const token = signToken(user);

  return res.status(statusCode).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
}

export async function register(req, res) {
  try {
    const { email, password, fullName, role = 'customer' } = req.body ?? {};
    const validationError = validateCredentials({ email, password, fullName, role });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.createUser({
      email,
      password,
      fullName: fullName?.trim() || email.split('@')[0],
      role,
    });

    return issueAuthResponse(res, user, 201);
  } catch (error) {
    console.error('Register failed:', error.message);
    return res.status(500).json({ message: 'Unable to create account' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};
    const validationError = validateCredentials({ email, password });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await User.findByEmail(email);

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await User.comparePassword(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return issueAuthResponse(res, {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).json({ message: 'Unable to log in' });
  }
}

export async function getMe(req, res) {
  res.json({ user: req.user });
}

export async function customerDashboard(req, res) {
  res.json({
    message: 'Customer dashboard',
    user: req.user,
  });
}

export async function providerDashboard(req, res) {
  res.json({
    message: 'Provider dashboard',
    user: req.user,
  });
}
