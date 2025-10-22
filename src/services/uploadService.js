import { ImageService } from './imageService.js';

/**
 * 上传服务
 */
export class UploadService {
  /**
   * 处理单个文件上传
   */
  static async handleSingleUpload(file) {
    if (!file) {
      return { success: false, message: '未选择文件' };
    }
    
    const url = ImageService.getImageUrl(file.filename);
    
    return {
      success: true,
      url,
      filename: file.filename,
      localPath: file.path,
      size: file.size,
      mimetype: file.mimetype
    };
  }
  
  /**
   * 处理多个文件上传
   */
  static async handleMultipleUpload(files) {
    if (!files || files.length === 0) {
      return { success: false, message: '未选择文件' };
    }
    
    const uploadedFiles = files.map(file => ({
      filename: file.filename,
      url: ImageService.getImageUrl(file.filename),
      size: file.size,
      mimetype: file.mimetype
    }));
    
    return {
      success: true,
      count: uploadedFiles.length,
      files: uploadedFiles,
      message: `成功上传 ${uploadedFiles.length} 个文件`
    };
  }
}

