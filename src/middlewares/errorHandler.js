import { logger } from '../utils/logger.js';
import { serverErrorResponse } from '../utils/response.js';

/**
 * 全局错误处理中间件
 */
export function errorHandler(err, req, res, next) {
  logger.error('未捕获的错误:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  // 处理 Multer 错误
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: '文件大小超过限制'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: '文件数量超过限制'
      });
    }
  }
  
  // 默认错误响应
  return serverErrorResponse(res, err);
}

/**
 * 404 错误处理
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: '请求的资源不存在'
  });
}

