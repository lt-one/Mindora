/**
 * JWT令牌生成与验证工具
 */
import jwt from 'jsonwebtoken';

// 获取JWT密钥，如果不存在则抛出错误
const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET环境变量未设置');
}

// 令牌过期时间配置
const ACCESS_TOKEN_EXPIRES = '15m'; // 15分钟
const REFRESH_TOKEN_EXPIRES = '7d'; // 7天

// 用户令牌数据接口
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number; // 签发时间
  exp?: number; // 过期时间
}

/**
 * 生成访问令牌
 * @param payload 令牌数据
 * @returns 访问令牌
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

/**
 * 生成刷新令牌
 * @param payload 令牌数据
 * @returns 刷新令牌
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
}

/**
 * 生成会话令牌
 * @returns 会话令牌
 */
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * 验证令牌
 * @param token 令牌
 * @returns 令牌数据或null（无效令牌）
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
} 