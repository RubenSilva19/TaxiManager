// routes/index.js
import { Router } from 'express';
import authRoutes from './auth.js';
import tripRoutes from './trip.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/trip', tripRoutes);

export default router;
