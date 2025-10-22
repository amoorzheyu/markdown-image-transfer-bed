// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// 响应消息
export const MESSAGES = {
  // 认证相关
  LOGIN_SUCCESS: '登录成功',
  LOGIN_FAILED: '用户名或密码错误',
  LOGOUT_SUCCESS: '退出登录成功',
  UNAUTHORIZED: '未授权，请先登录',
  
  // 图片上传相关
  UPLOAD_SUCCESS: '上传成功',
  UPLOAD_FAILED: '上传失败',
  NO_FILES: '未选择文件',
  INVALID_FILE_TYPE: '不支持的文件类型',
  FILE_TOO_LARGE: '文件大小超过限制',
  
  // 图片操作相关
  DELETE_SUCCESS: '删除成功',
  DELETE_FAILED: '删除失败',
  BATCH_DELETE_SUCCESS: '批量删除成功',
  IMAGE_NOT_FOUND: '图片不存在',
  
  // 系统错误
  INTERNAL_ERROR: '服务器内部错误'
};

// 文件上传配置
export const UPLOAD_CONFIG = {
  FIELD_NAME: 'images',
  MAX_COUNT: 10,
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
};

// Session 配置
export const SESSION_CONFIG = {
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 24小时
  COOKIE_NAME: 'image-host-session'
};

