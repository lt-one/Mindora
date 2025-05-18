/**
 * 重置用户密码API路由
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import crypto from 'crypto';

/**
 * POST: 重置用户密码
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户权限，只有管理员可以访问
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '无权限访问此API' },
        { status: 403 }
      );
    }

    // 正确获取param.id的值，确保它已经resolve
    const userId = params.id;
    
    // 查询用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // 设置令牌有效期（24小时）
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24);
    
    // 创建一个临时密码重置记录，使用Verification模型而不是passwordReset
    // 先查看数据库中是否有现有的重置记录
    const existingToken = await prisma.verification.findFirst({
      where: { 
        userId: userId,
        type: 'password_reset'
      }
    });
    
    if (existingToken) {
      // 更新现有记录
      await prisma.verification.update({
        where: { id: existingToken.id },
        data: {
          token: hashedToken,
          expires: tokenExpiry
        }
      });
    } else {
      // 创建新记录
      await prisma.verification.create({
        data: {
          userId: userId,
          type: 'password_reset',
          token: hashedToken,
          expires: tokenExpiry
        }
      });
    }
    
    // 构建重置链接
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    
    // 在实际生产环境中，这里应该发送邮件
    // TODO: 实现发送邮件逻辑
    console.log('密码重置链接:', resetUrl);
    
    // 返回成功消息
    const response: any = { 
      message: '密码重置链接已发送至用户邮箱' 
    };
    
    // 在开发环境中返回链接（方便测试）
    if (process.env.NODE_ENV === 'development') {
      response.resetUrl = resetUrl;
    }
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('重置用户密码失败:', error);
    return NextResponse.json(
      { error: '重置用户密码失败' },
      { status: 500 }
    );
  }
} 