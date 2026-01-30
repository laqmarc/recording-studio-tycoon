import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: Number(process.env.PORT || 3001),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'studio_user',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'studio_tycoon'
  },
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecure: String(process.env.COOKIE_SECURE || 'false') === 'true',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  cloudApiBase: process.env.CLOUD_API_BASE || '',
  debugErrors: String(process.env.DEBUG_ERRORS || 'false') === 'true'
};

export default config;
