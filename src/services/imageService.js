import path from 'path';
import { env } from '../config/env.js';
import {
  getFilesInDir,
  getFileStats,
  deleteFile,
  fileExists,
  getProjectRoot
} from '../utils/fileHelper.js';
import { formatBytes } from '../utils/formatter.js';

/**
 * 图片服务
 */
export class ImageService {
  /**
   * 获取图片目录路径
   */
  static getImageDirPath() {
    return path.join(getProjectRoot(), env.UPLOAD_DIR);
  }
  
  /**
   * 获取图片完整路径
   */
  static getImagePath(filename) {
    return path.join(this.getImageDirPath(), filename);
  }
  
  /**
   * 获取图片 URL
   */
  static getImageUrl(filename) {
    return `${env.BASE_URL}/${env.UPLOAD_DIR}/${filename}`;
  }
  
  /**
   * 获取所有图片列表
   */
  static async getImageList() {
    const imageDirPath = this.getImageDirPath();
    const files = await getFilesInDir(imageDirPath);
    
    // 过滤并获取图片信息
    const imagePromises = files.map(async (filename) => {
      const filePath = this.getImagePath(filename);
      const stats = await getFileStats(filePath);
      
      if (!stats || !stats.isFile) {
        return null;
      }
      
      return {
        filename,
        url: this.getImageUrl(filename),
        size: stats.size,
        sizeFormatted: formatBytes(stats.size),
        created: stats.created,
        modified: stats.modified
      };
    });
    
    const images = await Promise.all(imagePromises);
    
    // 过滤 null 值并按创建时间倒序排序
    return images
      .filter(img => img !== null)
      .sort((a, b) => new Date(b.created) - new Date(a.created));
  }
  
  /**
   * 删除单个图片
   */
  static async deleteImage(filename) {
    const filePath = this.getImagePath(filename);
    
    // 检查文件是否存在
    const exists = await fileExists(filePath);
    if (!exists) {
      return { success: false, message: '图片不存在' };
    }
    
    // 删除文件
    const deleted = await deleteFile(filePath);
    
    if (deleted) {
      return { success: true, message: '删除成功' };
    } else {
      return { success: false, message: '删除失败' };
    }
  }
  
  /**
   * 批量删除图片
   */
  static async batchDeleteImages(filenames) {
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    for (const filename of filenames) {
      const result = await this.deleteImage(filename);
      
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({ filename, error: result.message });
      }
    }
    
    return results;
  }
  
  /**
   * 获取统计信息
   */
  static async getStats() {
    const images = await this.getImageList();
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    
    return {
      totalImages: images.length,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize)
    };
  }
  
  /**
   * 检查图片是否存在
   */
  static async imageExists(filename) {
    const filePath = this.getImagePath(filename);
    return await fileExists(filePath);
  }
}

