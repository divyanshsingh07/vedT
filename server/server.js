import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import adminRoutes, { userRout } from './routes/adminRoutes.js';
import blogRouter from './routes/blogRouter.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    
    "http://localhost:5173"
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json({ limit: '20mb' })); // Increased limit for JSON payloads
app.use(express.urlencoded({ extended: true, limit: '20mb' })); // Increased limit for URL-encoded payloads

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: 'checking...'
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
