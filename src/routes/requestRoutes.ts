import express from 'express';
import { createRequest, getRequests } from '../controllers/requestController';

const router = express.Router();

router.post('/create', createRequest);
router.get('/get', getRequests);

export default router;