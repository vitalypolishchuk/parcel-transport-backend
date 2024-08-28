import express from 'express';
import { createRequest, deleteRequest, editRequest, getRequests } from '../controllers/requestController';

const router = express.Router();

router.post('/create', createRequest);
router.get('/get', getRequests);
router.delete('/delete', deleteRequest);
router.post('/edit', editRequest)

export default router;