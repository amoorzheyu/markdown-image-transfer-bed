import express from 'express';
import { UploadController } from '../controllers/uploadController.js';
import { uploadMiddleware } from '../middlewares/upload.js';
import { requireAuth } from '../middlewares/auth.js';
import { UPLOAD_CONFIG } from '../config/constants.js';

const router = express.Router();

// 管理后台上传（需要登录认证）
// 实际路径: /api/upload
router.post(
  '/upload',
  requireAuth,
  uploadMiddleware.array(UPLOAD_CONFIG.FIELD_NAME, UPLOAD_CONFIG.MAX_COUNT),
  UploadController.uploadMultiple
);

export default router;

