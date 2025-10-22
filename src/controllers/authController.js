import { AuthService } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { MESSAGES, HTTP_STATUS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

/**
 * 认证控制器
 */
export class AuthController {
  /**
   * 用户登录
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // 验证输入
      if (!username || !password) {
        return errorResponse(res, '用户名和密码不能为空');
      }
      
      // 验证凭据
      const isValid = AuthService.validateCredentials(username, password);
      
      if (!isValid) {
        logger.warn('登录失败', { username, ip: req.ip });
        return errorResponse(res, MESSAGES.LOGIN_FAILED, HTTP_STATUS.UNAUTHORIZED);
      }
      
      // 创建会话
      AuthService.createSession(req, username);
      
      logger.info('用户登录成功', { username, ip: req.ip });
      
      return successResponse(res, {
        username
      }, MESSAGES.LOGIN_SUCCESS);
      
    } catch (error) {
      logger.error('登录处理失败', error);
      return errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * 用户登出
   */
  static async logout(req, res) {
    try {
      const username = req.session?.username;
      
      await AuthService.destroySession(req);
      
      logger.info('用户退出登录', { username });
      
      return successResponse(res, {}, MESSAGES.LOGOUT_SUCCESS);
      
    } catch (error) {
      logger.error('登出处理失败', error);
      return errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * 检查认证状态
   */
  static async checkAuth(req, res) {
    try {
      const isAuth = AuthService.isAuthenticated(req);
      const user = AuthService.getCurrentUser(req);
      
      return res.json({
        authenticated: isAuth,
        username: user?.username || null,
        loginTime: user?.loginTime || null
      });
      
    } catch (error) {
      logger.error('检查认证状态失败', error);
      return res.json({ authenticated: false });
    }
  }
}

