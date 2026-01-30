export function rateLimit({ windowMs = 60000, max = 60 } = {}) {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.path}`;
    const entry = hits.get(key);
    if (!entry || (now - entry.start) > windowMs) {
      hits.set(key, { start: now, count: 1 });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({ error: 'rate_limited' });
    }
    return next();
  };
}
