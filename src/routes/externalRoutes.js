import express from 'express';
import { UploadController } from '../controllers/uploadController.js';
import { uploadMiddleware } from '../middlewares/upload.js';
import { binaryUploadMiddleware } from '../middlewares/binaryUpload.js';
import { apiKeyAuth } from '../middlewares/auth.js';
import { env } from '../config/env.js';

const router = express.Router();

/**
 * 外部 API 上传接口
 * 支持两种方式：
 * 1. multipart/form-data: 标准表单上传
 * 2. application/octet-stream: 直接二进制流上传
 */
router.post(
  '/upload',
  apiKeyAuth(env.API_KEY),
  binaryUploadMiddleware,  // 处理二进制流
  uploadMiddleware.single('file'),  // 处理 multipart（如果不是二进制流）
  UploadController.uploadSingle
);

export default router;

