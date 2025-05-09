/**
 * 适用于Edge Runtime的简化版日志记录器
 * 不依赖Node.js特定模块(fs、path等)
 */

/**
 * 记录访问信息
 * @param method 请求方法
 * @param url 请求URL
 * @param status 状态码
 * @param ip 请求IP
 * @param userAgent 用户代理
 */
export const logAccess = (method: string, url: string, status: number, ip: string, userAgent?: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[ACCESS] ${method} ${url} ${status} ${ip} ${userAgent || '-'}`);
  }
};

/**
 * 记录错误信息
 * @param error 错误对象
 * @param context 错误上下文
 */
export const logError = (error: Error, context?: string) => {
  console.error(`[ERROR]${context ? ` in ${context}` : ''} ${error.message}`);
};

/**
 * 记录应用信息
 * @param message 信息内容
 * @param meta 元数据
 */
export const logInfo = (message: string, meta?: Record<string, any>) => {
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[INFO] ${message} ${meta ? JSON.stringify(meta) : ''}`);
  }
};

/**
 * 记录警告信息
 * @param message 警告内容
 * @param meta 元数据
 */
export const logWarn = (message: string, meta?: Record<string, any>) => {
  console.warn(`[WARN] ${message} ${meta ? JSON.stringify(meta) : ''}`);
};

/**
 * 记录调试信息
 * @param message 调试内容
 * @param meta 元数据
 */
export const logDebug = (message: string, meta?: Record<string, any>) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[DEBUG] ${message} ${meta ? JSON.stringify(meta) : ''}`);
  }
}; 