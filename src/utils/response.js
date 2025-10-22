import { HTTP_STATUS } from '../config/constants.js';

/**
 * 成功响应
 */
export function successResponse(res, data = {}, message = 'success', statusCode = HTTP_STATUS.OK) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
}

/**
 * 错误响应
 */
export function errorResponse(res, message = 'error', statusCode = HTTP_STATUS.BAD_REQUEST, error = null) {
  const response = {
    success: false,
    error: message
  };
  
  if (error && process.env.NODE_ENV === 'development') {
    response.details = error.message;
  }
  
  return res.status(statusCode).json(response);
}

/**
 * 未授权响应
 */
export function unauthorizedResponse(res, message = '未授权') {
  return errorResponse(res, message, HTTP_STATUS.UNAUTHORIZED);
}

/**
 * 未找到响应
 */
export function notFoundResponse(res, message = '资源未找到') {
  return errorResponse(res, message, HTTP_STATUS.NOT_FOUND);
}

/**
 * 服务器错误响应
 */
export function serverErrorResponse(res, error, message = '服务器内部错误') {
  console.error('Server Error:', error);
  return errorResponse(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
}

