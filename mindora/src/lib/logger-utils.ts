/**
 * 日志工具模块
 * 用于在不同环境中选择合适的logger实现
 */

// 检测当前运行环境
const isServer = typeof window === 'undefined';

/**
 * 创建客户端logger
 */
function createClientLogger() {
  return {
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
}

// 导出通用logger（不管在哪个环境都能安全使用）
const logger = createClientLogger();

export default logger; 