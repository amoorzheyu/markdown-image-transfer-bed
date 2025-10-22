import { env } from '../config/env.js';

/**
 * 认证服务
 */
export class AuthService {
  /**
   * 验证用户凭据
   */
  static validateCredentials(username, password) {
    return username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD;
  }
  
  /**
   * 创建用户会话
   */
  static createSession(req, username) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    req.session.loginTime = new Date().toISOString();
  }
  
  /**
   * 销毁用户会话
   */
  static destroySession(req) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  
  /**
   * 检查用户是否已认证
   */
  static isAuthenticated(req) {
    return req.session && req.session.isAuthenticated === true;
  }
  
  /**
   * 获取当前用户信息
   */
  static getCurrentUser(req) {
    if (!this.isAuthenticated(req)) {
      return null;
    }
    
    return {
      username: req.session.username,
      loginTime: req.session.loginTime
    };
  }
}

