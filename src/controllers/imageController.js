import { ImageService } from '../services/imageService.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.js';
import { MESSAGES, HTTP_STATUS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

/**
 * 图片管理控制器
 */
export class ImageController {
  /**
   * 获取图片列表
   */
  static async getImageList(req, res) {
    try {
      const images = await ImageService.getImageList();
      
      return successResponse(res, { images });
      
    } catch (error) {
      logger.error('获取图片列表失败', error);
      return errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * 删除图片
   */
  static async deleteImage(req, res) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return errorResponse(res, '文件名不能为空');
      }
      
      const result = await ImageService.deleteImage(filename);
      
      if (result.success) {
        logger.info('删除图片成功', { filename });
        return successResponse(res, {}, MESSAGES.DELETE_SUCCESS);
      } else {
        return notFoundResponse(res, result.message);
      }
      
    } catch (error) {
      logger.error('删除图片失败', error);
      return errorResponse(res, MESSAGES.DELETE_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * 批量删除图片
   */
  static async batchDelete(req, res) {
    try {
      const { filenames } = req.body;
      
      if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
        return errorResponse(res, '请提供要删除的文件列表');
      }
      
      const results = await ImageService.batchDeleteImages(filenames);
      
      logger.info('批量删除图片', {
        total: filenames.length,
        success: results.success,
        failed: results.failed
      });
      
      if (results.failed === 0) {
        return successResponse(res, {
          deleted: results.success
        }, MESSAGES.BATCH_DELETE_SUCCESS);
      } else {
        return successResponse(res, {
          deleted: results.success,
          failed: results.failed,
          errors: results.errors
        }, `删除完成，成功 ${results.success} 个，失败 ${results.failed} 个`);
      }
      
    } catch (error) {
      logger.error('批量删除失败', error);
      return errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
  
  /**
   * 获取统计信息
   */
  static async getStats(req, res) {
    try {
      const stats = await ImageService.getStats();
      
      return successResponse(res, { stats });
      
    } catch (error) {
      logger.error('获取统计信息失败', error);
      return errorResponse(res, MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

