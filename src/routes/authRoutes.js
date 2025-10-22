import express from 'express';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();

// 登录
router.post('/login', AuthController.login);

// 退出登录
router.post('/logout', AuthController.logout);

// 检查认证状态
router.get('/check-auth', AuthController.checkAuth);

export default router;

