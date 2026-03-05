import { Router } from 'express';
import { 
    createTrip, 
    getTripHistory, 
    getAllTrips 
} from '../controllers/tripController.js';

const router = Router();

router.post('/create', createTrip);
router.get('/:id/dailylogs', getTripHistory);
router.get('/:id/historico', getAllTrips);

export default router;