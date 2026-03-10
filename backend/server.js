import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000', // for local React dev
  'https://taximanager-z0bt.onrender.com/', // <-- put your real Render static-site URL here
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Use CORS before routes
app.use(cors(corsOptions));

app.use(express.json());

// Routes with /api prefix
app.use('/api', routes);

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('MongoDB erro:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor: ${PORT}`));

