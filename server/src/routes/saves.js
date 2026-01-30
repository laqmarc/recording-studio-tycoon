import express from 'express';
import pool, { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { v4 as uuid } from 'uuid';
import { rateLimit } from '../middleware/rate_limit.js';

const router = express.Router();

router.use(requireAuth);
router.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

router.get('/', async (req, res) => {
  const rows = await query(
    'SELECT id, slot_index, title, version, updated_at, created_at FROM saves WHERE user_id = :user_id ORDER BY slot_index ASC',
    { user_id: req.user.sub }
  );
  return res.json({ saves: rows });
});

router.post('/', async (req, res) => {
  const slotIndex = Number(req.body && req.body.slot_index);
  const payload = req.body && req.body.payload;
  const title = (req.body && req.body.title) ? String(req.body.title).slice(0, 120) : null;
  if (!Number.isFinite(slotIndex) || slotIndex < 1 || !payload) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  const id = uuid();
  try {
    await query(
      'INSERT INTO saves (id, user_id, slot_index, title, payload, version) VALUES (:id, :user_id, :slot_index, :title, :payload, 1)',
      {
        id,
        user_id: req.user.sub,
        slot_index: slotIndex,
        title,
        payload: JSON.stringify(payload)
      }
    );
  } catch (e) {
    if (String(e.code || '').toLowerCase().includes('duplicate')) {
      return res.status(409).json({ error: 'slot_taken' });
    }
    return res.status(500).json({ error: 'db_error' });
  }
  const rows = await query(
    'SELECT id, slot_index, title, version, updated_at, created_at FROM saves WHERE id = :id LIMIT 1',
    { id }
  );
  return res.status(201).json({ save: rows[0] });
});

router.get('/:id', async (req, res) => {
  const rows = await query(
    'SELECT id, slot_index, title, payload, version, updated_at, created_at FROM saves WHERE id = :id AND user_id = :user_id LIMIT 1',
    { id: req.params.id, user_id: req.user.sub }
  );
  if (!rows.length) return res.status(404).json({ error: 'not_found' });
  const save = rows[0];
  if (typeof save.payload === 'string') {
    try { save.payload = JSON.parse(save.payload); } catch (e) {}
  }
  return res.json({ save });
});

router.patch('/:id', async (req, res) => {
  const title = (req.body && req.body.title) ? String(req.body.title).slice(0, 120) : '';
  const rows = await query(
    'UPDATE saves SET title = :title WHERE id = :id AND user_id = :user_id',
    { id: req.params.id, user_id: req.user.sub, title }
  );
  return res.json({ ok: true, title });
});

router.post('/:id/duplicate', async (req, res) => {
  const slotIndex = Number(req.body && req.body.slot_index);
  const title = (req.body && req.body.title) ? String(req.body.title).slice(0, 120) : null;
  if (!Number.isFinite(slotIndex) || slotIndex < 1) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  const sourceRows = await query(
    'SELECT payload, title FROM saves WHERE id = :id AND user_id = :user_id LIMIT 1',
    { id: req.params.id, user_id: req.user.sub }
  );
  if (!sourceRows.length) return res.status(404).json({ error: 'not_found' });
  const source = sourceRows[0];
  const nextTitle = title || (source.title ? `${source.title} (copy)` : 'Copy');
  const payloadValue = (typeof source.payload === 'string')
    ? source.payload
    : JSON.stringify(source.payload);
  const id = uuid();
  try {
    await query(
      'INSERT INTO saves (id, user_id, slot_index, title, payload, version) VALUES (:id, :user_id, :slot_index, :title, :payload, 1)',
      {
        id,
        user_id: req.user.sub,
        slot_index: slotIndex,
        title: nextTitle,
        payload: payloadValue
      }
    );
  } catch (e) {
    if (String(e.code || '').toLowerCase().includes('duplicate')) {
      return res.status(409).json({ error: 'slot_taken' });
    }
    return res.status(500).json({ error: 'db_error' });
  }
  const rows = await query(
    'SELECT id, slot_index, title, version, updated_at, created_at FROM saves WHERE id = :id LIMIT 1',
    { id }
  );
  return res.status(201).json({ save: rows[0] });
});

router.put('/:id', async (req, res) => {
  const payload = req.body && req.body.payload;
  const version = Number(req.body && req.body.version);
  const title = (req.body && req.body.title) ? String(req.body.title).slice(0, 120) : null;
  if (!payload || !Number.isFinite(version)) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute(
      'SELECT id, version FROM saves WHERE id = ? AND user_id = ? FOR UPDATE',
      [req.params.id, req.user.sub]
    );
    if (!rows.length) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ error: 'not_found' });
    }
    const current = rows[0];
    if (Number(current.version) !== version) {
      await conn.rollback();
      conn.release();
      return res.status(409).json({ error: 'version_conflict', server_version: current.version });
    }
    const nextVersion = version + 1;
    await conn.execute(
      'UPDATE saves SET payload = ?, version = ?, title = ? WHERE id = ? AND user_id = ?',
      [JSON.stringify(payload), nextVersion, title, req.params.id, req.user.sub]
    );
    await conn.commit();
    conn.release();
    return res.json({ ok: true, version: nextVersion });
  } catch (e) {
    try { await conn.rollback(); } catch (err) {}
    conn.release();
    return res.status(500).json({ error: 'db_error' });
  }
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM saves WHERE id = :id AND user_id = :user_id', {
    id: req.params.id,
    user_id: req.user.sub
  });
  return res.json({ ok: true });
});

export default router;
