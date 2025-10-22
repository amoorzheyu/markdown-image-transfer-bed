import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { env, validateEnv } from './config/env.js';
import { SESSION_CONFIG } from './config/constants.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import apiRoutes from './routes/index.js';
import externalRoutes from './routes/externalRoutes.js';
import { ensureDir } from './utils/fileHelper.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 验证环境变量
validateEnv();

// 创建 Express 应用
const app = express();

// 确保上传目录存在
await ensureDir(env.UPLOAD_DIR);

// CORS 配置（需要在最前面）
app.use(cors({
  origin: true,
  credentials: true
}));

// Cookie 解析器
app.use(cookieParser());

// Session 配置
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESSION_CONFIG.COOKIE_MAX_AGE,
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
  name: SESSION_CONFIG.COOKIE_NAME
}));

// 请求日志
if (env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// 静态文件服务
app.use('/admin', express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(express.static(path.join(__dirname, '../public')));

// 外部上传API（在 body parser 之前，以支持二进制流上传）
app.use('/', externalRoutes);

// Body 解析器（在外部上传路由之后）
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 管理后台API路由
app.use('/api', apiRoutes);

// 根路径重定向到管理界面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

logger.info('Express 应用初始化完成');

export default app;

