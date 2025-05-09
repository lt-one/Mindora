/**
 * 简单的内存缓存工具
 * 用于缓存API响应以减少请求次数
 */

interface CacheItem<T> {
  value: T;
  expiry: number;
}

class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();

  /**
   * 获取缓存项
   * @param key 缓存键
   * @returns 缓存值或undefined（如果不存在或已过期）
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    // 如果项目不存在或已过期，返回undefined
    if (!item || Date.now() > item.expiry) {
      if (item) {
        // 移除过期项
        this.cache.delete(key);
      }
      return undefined;
    }
    
    return item.value;
  }

  /**
   * 设置缓存项
   * @param key 缓存键
   * @param value 要缓存的值
   * @param ttl 生存时间（毫秒）
   */
  set<T>(key: string, value: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * 删除缓存项
   * @param key 缓存键
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 清除所有过期的缓存项
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// 导出单例实例
export const cache = new MemoryCache(); 