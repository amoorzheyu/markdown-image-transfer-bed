import { logger } from '../utils/logger.js';

/**
 * 请求日志中间件
 */
export function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  // 记录请求
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  
  // 响应完成后记录
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}

