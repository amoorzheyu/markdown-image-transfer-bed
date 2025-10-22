import express from 'express';
import { ImageController } from '../controllers/imageController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// 获取统计信息（需要认证）
router.get('/', requireAuth, ImageController.getStats);

export default router;

