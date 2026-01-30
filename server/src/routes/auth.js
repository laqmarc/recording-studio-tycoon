import express from 'express';
import { v4 as uuid } from 'uuid';
import { query } from '../db.js';
import { hashPassword, verifyPassword, signToken, verifyToken } from '../auth.js';
import config from '../config.js';
import { normalizeEmail, isValidEmail } from '../utils.js';
import { rateLimit } from '../middleware/rate_limit.js';

const router = express.Router();

function handleError(res, err) {
  console.error(err);
  const body = { error: 'server_error' };
  if (config.debugErrors) body.detail = String(err && err.message ? err.message : err);
  return res.status(500).json(body);
}

function safe(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      return handleError(res, e);
    }
  };
}

function setSessionCookie(res, token) {
  res.cookie('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.cookieSecure,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

function setCsrfCookie(res, token) {
  res.cookie('csrf', token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: config.cookieSecure,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

const loginLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 10 });
const registerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

router.get('/me', safe(async (req, res) => {
  const token = req.cookies && req.cookies.session;
  if (!token) return res.json({ user: null });
  try {
    const payload = verifyToken(token);
    return res.json({ user: { id: payload.sub, email: payload.email } });
  } catch (e) {
    return res.json({ user: null });
  }
}));

router.get('/csrf', safe(async (req, res) => {
  const token = uuid();
  setCsrfCookie(res, token);
  return res.json({ token });
}));

router.post('/register', registerLimiter, safe(async (req, res) => {
  const email = normalizeEmail(req.body && req.body.email);
  const password = String((req.body && req.body.password) || '');
  if (!isValidEmail(email) || password.length < 6) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  const existing = await query('SELECT id FROM users WHERE email = :email LIMIT 1', { email });
  if (existing.length) return res.status(409).json({ error: 'email_exists' });
  const id = uuid();
  const passwordHash = await hashPassword(password);
  await query('INSERT INTO users (id, email, password_hash) VALUES (:id, :email, :password_hash)', {
    id,
    email,
    password_hash: passwordHash
  });
  const token = signToken({ id, email });
  setSessionCookie(res, token);
  setCsrfCookie(res, uuid());
  return res.json({ user: { id, email } });
}));

router.post('/login', loginLimiter, safe(async (req, res) => {
  const email = normalizeEmail(req.body && req.body.email);
  const password = String((req.body && req.body.password) || '');
  if (!isValidEmail(email) || !password) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  const rows = await query('SELECT id, email, password_hash FROM users WHERE email = :email LIMIT 1', { email });
  if (!rows.length) return res.status(401).json({ error: 'invalid_credentials' });
  const user = rows[0];
  const ok = await verifyPassword(user.password_hash, password);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = signToken({ id: user.id, email: user.email });
  setSessionCookie(res, token);
  setCsrfCookie(res, uuid());
  return res.json({ user: { id: user.id, email: user.email } });
}));

router.post('/logout', generalLimiter, safe(async (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.cookieSecure
  });
  res.clearCookie('csrf', {
    httpOnly: false,
    sameSite: 'lax',
    secure: config.cookieSecure
  });
  return res.json({ ok: true });
}));

export default router;
