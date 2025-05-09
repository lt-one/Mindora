/**
 * 客户端日志记录模块
 * 提供与服务器端logger兼容的API，但在浏览器环境中使用console实现
 */

// 创建logger对象，使用console方法实现基本的日志功能
const logger = {
  error: (message: string, meta?: any) => {
    console.error(`[ERROR] ${message}`, meta);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  info: (message: string, meta?: any) => {
    console.info(`[INFO] ${message}`, meta);
  },
  debug: (message: string, meta?: any) => {
    console.debug(`[DEBUG] ${message}`, meta);
  }
};

/**
 * 记录访问信息
 * @param method 请求方法
 * @param url 请求URL
 * @param status 状态码
 * @param ip 请求IP
 * @param userAgent 用户代理
 */
export const logAccess = (method: string, url: string, status: number, ip: string, userAgent?: string) => {
  logger.info('Access', {
    method,
    url,
    status,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 记录错误信息
 * @param error 错误对象
 * @param context 错误上下文
 */
export const logError = (error: Error, context?: string) => {
  logger.error(`Error${context ? ` in ${context}` : ''}`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 记录应用信息
 * @param message 信息内容
 * @param meta 元数据
 */
export const logInfo = (message: string, meta?: Record<string, any>) => {
  logger.info(message, {
    ...meta,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 记录警告信息
 * @param message 警告内容
 * @param meta 元数据
 */
export const logWarn = (message: string, meta?: Record<string, any>) => {
  logger.warn(message, {
    ...meta,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 记录调试信息
 * @param message 调试内容
 * @param meta 元数据
 */
export const logDebug = (message: string, meta?: Record<string, any>) => {
  logger.debug(message, {
    ...meta,
    timestamp: new Date().toISOString(),
  });
};

export default logger; 