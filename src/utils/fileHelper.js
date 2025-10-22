import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 确保目录存在，不存在则创建
 */
export async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * 获取目录中的所有文件
 */
export async function getFilesInDir(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    return files;
  } catch (error) {
    console.error(`读取目录失败: ${dirPath}`, error);
    return [];
  }
}

/**
 * 获取文件信息
 */
export async function getFileStats(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    return null;
  }
}

/**
 * 删除文件
 */
export async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error(`删除文件失败: ${filePath}`, error);
    return false;
  }
}

/**
 * 检查文件是否存在
 */
export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取项目根目录
 */
export function getProjectRoot() {
  return path.resolve(__dirname, '../..');
}

