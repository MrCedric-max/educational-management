import express from 'express';
import { login, register, logout, refreshToken } from '../controllers/authController';

const router = express.Router();

// Authentication routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

export default router;









