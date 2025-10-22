/**
 * 格式化文件大小
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化日期
 */
export function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 生成唯一文件名
 */
export function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const ext = originalName.substring(originalName.lastIndexOf('.'));
  return `${timestamp}-${randomStr}${ext}`;
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename) {
  return filename.substring(filename.lastIndexOf('.')).toLowerCase();
}

/**
 * 验证文件扩展名
 */
export function isValidExtension(filename, allowedExtensions) {
  const ext = getFileExtension(filename);
  return allowedExtensions.includes(ext);
}

