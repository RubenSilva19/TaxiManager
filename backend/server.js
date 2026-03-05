import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas com prefixo /api
app.use('/api', routes);

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('MongoDB erro:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor: ${PORT}`));
