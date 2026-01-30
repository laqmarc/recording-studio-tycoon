export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function isValidEmail(email) {
  const value = normalizeEmail(email);
  return value.includes('@') && value.length <= 190;
}
