import multer from 'multer';
import path from 'path';
import { env } from '../config/env.js';
import { UPLOAD_CONFIG } from '../config/constants.js';
import { generateUniqueFilename } from '../utils/formatter.js';
import { ensureDir } from '../utils/fileHelper.js';

// 确保上传目录存在
await ensureDir(env.UPLOAD_DIR);

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 检查 MIME 类型
  if (env.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

// 创建 multer 实例
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: UPLOAD_CONFIG.MAX_COUNT
  }
});

