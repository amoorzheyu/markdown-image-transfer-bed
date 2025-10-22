import { generateUniqueFilename } from '../utils/formatter.js';
import { env } from '../config/env.js';
import { ensureDir } from '../utils/fileHelper.js';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

/**
 * 处理二进制流上传的中间件
 * 用于支持 Content-Type: application/octet-stream
 */
export async function binaryUploadMiddleware(req, res, next) {
  // 只处理非 multipart 的请求
  const contentType = req.headers['content-type'] || '';
  
  // 如果是 multipart，跳过此中间件
  if (contentType.includes('multipart')) {
    return next();
  }
  
  try {
    // 确保上传目录存在
    await ensureDir(env.UPLOAD_DIR);
    
    // 从 header 获取文件名或生成唯一文件名
    const originalName = req.headers['x-filename'] || 'upload.jpg';
    const filename = generateUniqueFilename(originalName);
    const filepath = path.join(env.UPLOAD_DIR, filename);
    
    // 创建写入流
    const writeStream = fs.createWriteStream(filepath);
    
    // 将请求流写入文件
    req.pipe(writeStream);
    
    // 等待写入完成
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      req.on('error', reject);
    });
    
    // 获取文件信息
    const stats = fs.statSync(filepath);
    
    // 确定 MIME 类型
    let mimetype = contentType;
    if (!mimetype || mimetype === 'application/octet-stream') {
      mimetype = mime.lookup(filename) || 'application/octet-stream';
    }
    
    // 将文件信息附加到请求对象
    req.file = {
      filename,
      path: filepath,
      originalname: originalName,
      mimetype,
      size: stats.size
    };
    
    next();
  } catch (error) {
    console.error('二进制上传失败:', error);
    return res.status(500).json({
      success: false,
      error: '文件上传失败'
    });
  }
}

