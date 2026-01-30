import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config.js';
import authRoutes from './routes/auth.js';
import savesRoutes from './routes/saves.js';
import { requireCsrf } from './middleware/csrf.js';

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-csrf-token']
}));
app.use(cookieParser());
app.use(express.json({ limit: '4mb' }));
app.use(requireCsrf);

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/saves', savesRoutes);

app.listen(config.port, () => {
  console.log(`Studio Tycoon API listening on :${config.port}`);
});
