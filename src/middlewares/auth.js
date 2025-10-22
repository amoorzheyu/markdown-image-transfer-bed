import { unauthorizedResponse } from '../utils/response.js';
import { MESSAGES } from '../config/constants.js';

/**
 * 认证中间件 - 检查用户是否已登录
 */
export function requireAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  
  return unauthorizedResponse(res, MESSAGES.UNAUTHORIZED);
}

/**
 * API Key 认证中间件 - 用于外部 API 调用
 */
export function apiKeyAuth(apiKey) {
  return (req, res, next) => {
    // 如果没有设置 API Key，则跳过验证
    if (!apiKey) {
      return next();
    }
    
    const requestApiKey = req.headers['x-api-key'];
    
    if (requestApiKey === apiKey) {
      return next();
    }
    
    return unauthorizedResponse(res, 'Invalid API Key');
  };
}

/**
 * 可选认证 - Session 或 API Key 都可以
 */
export function optionalAuth(apiKey) {
  return (req, res, next) => {
    // 检查 Session 认证
    if (req.session && req.session.isAuthenticated) {
      return next();
    }
    
    // 检查 API Key 认证
    if (apiKey) {
      const requestApiKey = req.headers['x-api-key'];
      if (requestApiKey === apiKey) {
        return next();
      }
    }
    
    return unauthorizedResponse(res, MESSAGES.UNAUTHORIZED);
  };
}

