/**
 * 用户认证服务
 */
import { addDays, addHours } from 'date-fns';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, verifyPassword } from './bcrypt';
import { generateAccessToken, generateRefreshToken, generateSessionToken, TokenPayload, verifyToken } from './jwt';
import { Prisma, User } from '@prisma/client';

// 扩展用户类型，添加缺少的字段
type ExtendedUser = User & {
  isActive?: boolean;
  role?: string;
  emailVerified?: Date | null;
  refreshToken?: string | null;
  tokenExpiry?: Date | null;
  lastLogin?: Date | null;
};

// 用户结构
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  emailVerified?: Date | null;
}

// 登录凭证结构
export interface Credentials {
  email: string;
  password: string;
}

// 认证结果结构
export interface AuthResult {
  success: boolean;
  user?: UserData;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
}

// 注册请求结构
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * 用户登录
 * @param credentials 登录凭证
 * @returns 认证结果
 */
export async function login(credentials: Credentials): Promise<AuthResult> {
  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    }) as ExtendedUser;

    // 用户不存在
    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    // 验证密码
    const isValid = await verifyPassword(credentials.password, user.password);
    if (!isValid) {
      return { success: false, message: '密码错误' };
    }

    // 检查账户状态
    if (user.isActive !== undefined && !user.isActive) {
      return { success: false, message: '账户已禁用' };
    }

    // 生成令牌
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'user'
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const sessionToken = generateSessionToken();
    
    // 更新用户最后登录时间和刷新令牌
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLogin: new Date(),
        refreshToken,
        tokenExpiry: addDays(new Date(), 7) // 7天后过期
      } as Prisma.UserUpdateInput
    });
    
    // 创建会话记录
    await (prisma as any).session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expires: addDays(new Date(), 7) // 7天后过期
      }
    });

    // 返回认证成功结果
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        image: user.image,
        emailVerified: user.emailVerified
      },
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.error('登录失败:', error);
    return { success: false, message: '登录过程发生错误' };
  }
}

/**
 * 用户注册
 * @param userData 用户数据
 * @returns 注册结果
 */
export async function register(userData: RegisterRequest): Promise<AuthResult> {
  try {
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return { success: false, message: '邮箱已被注册' };
    }

    // 加密密码
    const hashedPassword = await hashPassword(userData.password);

    // 创建用户
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: 'user' // 默认角色
      } as Prisma.UserCreateInput
    }) as ExtendedUser;

    // 生成验证令牌
    const verificationToken = generateSessionToken();
    
    // 创建验证记录
    await (prisma as any).verification.create({
      data: {
        userId: newUser.id,
        type: 'email',
        token: verificationToken,
        expires: addHours(new Date(), 24) // 24小时后过期
      }
    });

    // 这里应该发送验证邮件，但现在先省略

    // 返回注册成功结果
    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'user',
        image: newUser.image,
        emailVerified: newUser.emailVerified
      },
      message: '注册成功，请查收验证邮件'
    };
  } catch (error) {
    console.error('注册失败:', error);
    return { success: false, message: '注册过程发生错误' };
  }
}

/**
 * 刷新令牌
 * @param refreshToken 刷新令牌
 * @returns 认证结果
 */
export async function refreshTokens(refreshToken: string): Promise<AuthResult> {
  try {
    // 验证刷新令牌
    const payload = verifyToken(refreshToken);
    if (!payload) {
      return { success: false, message: '无效的刷新令牌' };
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    }) as ExtendedUser;

    if (!user || user.refreshToken !== refreshToken || !user.tokenExpiry || user.tokenExpiry < new Date()) {
      return { success: false, message: '刷新令牌已过期或无效' };
    }

    // 生成新令牌
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'user'
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // 更新用户的刷新令牌
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
        tokenExpiry: addDays(new Date(), 7) // 7天后过期
      } as Prisma.UserUpdateInput
    });

    // 返回刷新成功结果
    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        image: user.image,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    console.error('刷新令牌失败:', error);
    return { success: false, message: '刷新令牌过程发生错误' };
  }
}

/**
 * 验证用户邮箱
 * @param token 验证令牌
 * @returns 验证结果
 */
export async function verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  try {
    // 查找验证记录
    const verification = await (prisma as any).verification.findUnique({
      where: { token }
    });

    if (!verification) {
      return { success: false, message: '无效的验证令牌' };
    }

    if (verification.expires < new Date()) {
      return { success: false, message: '验证令牌已过期' };
    }

    if (verification.type !== 'email') {
      return { success: false, message: '无效的验证类型' };
    }

    // 更新用户的邮箱验证状态
    await prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerified: new Date() } as Prisma.UserUpdateInput
    });

    // 删除验证记录
    await (prisma as any).verification.delete({
      where: { id: verification.id }
    });

    return { success: true, message: '邮箱验证成功' };
  } catch (error) {
    console.error('邮箱验证失败:', error);
    return { success: false, message: '验证过程发生错误' };
  }
}

/**
 * 请求重置密码
 * @param email 用户邮箱
 * @returns 请求结果
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // 为了安全，不泄露用户是否存在的信息
      return { success: true, message: '如果该邮箱存在，重置密码链接已发送' };
    }

    // 生成重置令牌
    const resetToken = generateSessionToken();

    // 创建验证记录
    await (prisma as any).verification.create({
      data: {
        userId: user.id,
        type: 'password_reset',
        token: resetToken,
        expires: addHours(new Date(), 1) // 1小时后过期
      }
    });

    // 这里应该发送重置密码邮件，但现在先省略

    return { success: true, message: '重置密码链接已发送到您的邮箱' };
  } catch (error) {
    console.error('请求重置密码失败:', error);
    return { success: false, message: '请求重置密码过程发生错误' };
  }
}

/**
 * 重置密码
 * @param token 重置令牌
 * @param newPassword 新密码
 * @returns 重置结果
 */
export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    // 查找验证记录
    const verification = await (prisma as any).verification.findUnique({
      where: { token }
    });

    if (!verification) {
      return { success: false, message: '无效的重置令牌' };
    }

    if (verification.expires < new Date()) {
      return { success: false, message: '重置令牌已过期' };
    }

    if (verification.type !== 'password_reset') {
      return { success: false, message: '无效的验证类型' };
    }

    // 加密新密码
    const hashedPassword = await hashPassword(newPassword);

    // 更新用户密码
    await prisma.user.update({
      where: { id: verification.userId },
      data: { password: hashedPassword }
    });

    // 删除验证记录
    await (prisma as any).verification.delete({
      where: { id: verification.id }
    });

    // 删除用户的所有会话
    await (prisma as any).session.deleteMany({
      where: { userId: verification.userId }
    });

    return { success: true, message: '密码重置成功，请使用新密码登录' };
  } catch (error) {
    console.error('重置密码失败:', error);
    return { success: false, message: '重置密码过程发生错误' };
  }
}

/**
 * 登出
 * @param userId 用户ID
 * @param sessionToken 会话令牌
 * @returns 登出结果
 */
export async function logout(userId: string, sessionToken?: string): Promise<{ success: boolean }> {
  try {
    if (sessionToken) {
      // 删除特定会话
      await (prisma as any).session.deleteMany({
        where: {
          userId,
          token: sessionToken
        }
      });
    } else {
      // 删除所有会话
      await (prisma as any).session.deleteMany({
        where: { userId }
      });

      // 清除用户的刷新令牌
      await prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
          tokenExpiry: null
        } as Prisma.UserUpdateInput
      });
    }

    return { success: true };
  } catch (error) {
    console.error('登出失败:', error);
    return { success: false };
  }
} 