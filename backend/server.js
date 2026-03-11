import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

console.log('🔍 MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('🔍 MONGODB_URI starts with:', process.env.MONGODB_URI?.substring(0, 20) + '...');
console.log('🔍 PORT:', process.env.PORT);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

const app = express();

app.use(cors({
  origin: ['https://taximanager-z0bt.onrender.com', 'http://localhost:5173'],
  credentials: true
}));

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

