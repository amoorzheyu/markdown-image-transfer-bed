/**
 * 简单的日志工具
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

function formatLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let log = `[${timestamp}] [${level}] ${message}`;
  
  if (data) {
    log += ` ${JSON.stringify(data)}`;
  }
  
  return log;
}

export const logger = {
  info: (message, data) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, data));
  },
  
  warn: (message, data) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, data));
  },
  
  error: (message, data) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, data));
  },
  
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog(LOG_LEVELS.DEBUG, message, data));
    }
  }
};

