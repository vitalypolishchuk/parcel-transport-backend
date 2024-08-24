import express from 'express';
import { register, login, validate, user } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate', validate)
router.get('/user', user)

export default router;