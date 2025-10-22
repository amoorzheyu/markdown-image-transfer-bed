import express from 'express';
import { ImageController } from '../controllers/imageController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// 所有图片相关路由都需要认证
router.use(requireAuth);

// 获取图片列表
router.get('/', ImageController.getImageList);

// 删除单个图片
router.delete('/:filename', ImageController.deleteImage);

// 批量删除
router.post('/batch-delete', ImageController.batchDelete);

export default router;

