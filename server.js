import app from './src/app.js';
import { env } from './src/config/env.js';
import { logger } from './src/utils/logger.js';

const PORT = env.PORT;

// 启动服务器
app.listen(PORT, () => {
  logger.info(`🚀 服务器已启动`);
  logger.info(`📡 监听端口: ${PORT}`);
  logger.info(`🌐 访问地址: http://localhost:${PORT}`);
  logger.info(`📊 管理后台: http://localhost:${PORT}/admin`);
  logger.info(`🔧 运行环境: ${env.NODE_ENV}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

// 未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的 Promise 拒绝:', { reason, promise });
});

