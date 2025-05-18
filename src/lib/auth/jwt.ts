/**
 * JWT令牌生成与验证工具
 */
import jwt from 'jsonwebtoken';

// 获取JWT密钥，使用默认密钥作为备用
const JWT_SECRET = process.env.JWT_SECRET || 'mindora_default_jwt_secret_key_development_only';
// 删除严格检查，改为使用默认值
// if (!JWT_SECRET) {
//   throw new Error('JWT_SECRET环境变量未设置');
// }

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
 * 验证令牌
 * @param token JWT令牌
 * @returns 令牌负载数据，验证失败则返回null
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * 生成会话令牌
 * @returns 会话令牌
 */
export function generateSessionToken(): string {
  // 生成一个随机会话令牌 (32字符)
  return Math.random().toString(36).substring(2, 10) + 
         Math.random().toString(36).substring(2, 10) +
         Math.random().toString(36).substring(2, 10) +
         Math.random().toString(36).substring(2, 10);
} 