import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import adminRoutes, { userRout } from './routes/adminRoutes.js';
import blogRouter from './routes/blogRouter.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Allowed origins: from env (comma-separated) or defaults for development
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000', 'https://vedt.onrender.com', 'https://blog.divyansh.codes'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    if (process.env.NODE_ENV === 'production') return cb(null, false);
    return cb(null, true);
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(helmet({ contentSecurityPolicy: false })); // Set to an object to tune CSP if needed

// Rate limiting: 100 requests per 15 minutes per IP (stricter for auth in routes if needed)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Connect to Database (await to avoid buffering timeouts on first requests)
await connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB on startup:', err?.message || err);
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api", userRout);
app.use("/api/blog", blogRouter);

// Basic route to show server is running
app.get('/', (req, res) => {
  res.json({ message: "Server is running" });
});

// Health check endpoint (for load balancers and monitoring)
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.json({
    status: dbState === 1 ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// In serverless environments like Vercel, we should NOT call app.listen().
// Vercel will handle the HTTP server and invoke the exported app as a handler.
// Only start a local server when running locally (e.g., npm run dev).
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
