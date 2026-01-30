const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function requireCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const token = req.headers['x-csrf-token'];
  const cookie = req.cookies && req.cookies.csrf;
  if (!token || !cookie || token !== cookie) {
    return res.status(403).json({ error: 'csrf' });
  }
  return next();
}
