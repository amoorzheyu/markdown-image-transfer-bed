import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export const env = {
  // 服务器配置
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  
  // 认证配置
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  
  // Cookie 配置
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',  // 默认 false，支持 HTTP
  
  // API 配置
  API_KEY: process.env.API_KEY,
  
  // 上传配置
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'images',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
};

// 验证必需的环境变量
export function validateEnv() {
  if (!env.ADMIN_PASSWORD) {
    console.warn('⚠️  警告: 未设置 ADMIN_PASSWORD 环境变量');
  }
  
  if (env.SESSION_SECRET === 'your-secret-key-change-this') {
    console.warn('⚠️  警告: 请修改 SESSION_SECRET 为随机字符串');
  }
  
  if (env.NODE_ENV === 'production' && !env.COOKIE_SECURE) {
    console.warn('⚠️  提示: 生产环境下 COOKIE_SECURE=false，支持 HTTP 访问（如需 HTTPS 专用请设置 COOKIE_SECURE=true）');
  }
}

