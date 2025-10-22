import { UploadService } from '../services/uploadService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { MESSAGES, HTTP_STATUS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

/**
 * 上传控制器
 */
export class UploadController {
  /**
   * 处理管理后台的多文件上传
   */
  static async uploadMultiple(req, res) {
    try {
      const files = req.files;
      
      if (!files || files.length === 0) {
        return errorResponse(res, MESSAGES.NO_FILES);
      }
      
      const result = await UploadService.handleMultipleUpload(files);
      
      logger.info('批量上传成功', { count: files.length });
      
      return successResponse(res, result, result.message, HTTP_STATUS.CREATED);
      
    } catch (error) {
      logger.error('上传失败', error);
      return errorResponse(res, MESSAGES.UPLOAD_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * 处理外部 API 的单文件上传（兼容旧接口）
   */
  static async uploadSingle(req, res) {
    try {
      const file = req.file;
      
      if (!file) {
        return errorResponse(res, MESSAGES.NO_FILES);
      }
      
      const result = await UploadService.handleSingleUpload(file);
      
      logger.info('单文件上传成功', { filename: file.filename });
      
      return successResponse(res, result, MESSAGES.UPLOAD_SUCCESS, HTTP_STATUS.CREATED);
      
    } catch (error) {
      logger.error('上传失败', error);
      return errorResponse(res, MESSAGES.UPLOAD_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

