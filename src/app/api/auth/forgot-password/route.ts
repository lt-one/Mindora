/**
 * 忘记密码API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateSessionToken } from '@/lib/auth/jwt';
import { addHours } from 'date-fns';

export async function POST(request: Request) {
  try {
    // 获取请求数据
    const body = await request.json();
    const { email } = body;
    
    // 验证邮箱
    if (!email) {
      return NextResponse.json(
        { success: false, message: '邮箱为必填项' },
        { status: 400 }
      );
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: '邮箱格式不正确' },
        { status: 400 }
      );
    }
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // 即使用户不存在，也返回成功以防用户枚举攻击
    if (!user) {
      return NextResponse.json(
        { success: true, message: '如果该邮箱已注册，您将收到重置密码的链接' },
        { status: 200 }
      );
    }
    
    // 生成重置令牌
    const resetToken = generateSessionToken();
    const tokenExpiry = addHours(new Date(), 1); // 1小时后过期
    
    // 查找现有的验证记录
    const existingVerifications = await prisma.verification.findMany({
      where: {
        userId: user.id,
        type: 'password_reset'
      }
    });
    
    if (existingVerifications.length > 0) {
      // 更新现有记录
      await prisma.verification.update({
        where: { id: existingVerifications[0].id },
        data: {
          token: resetToken,
          expires: tokenExpiry
        }
      });
    } else {
      // 创建新记录
      await prisma.verification.create({
        data: {
          userId: user.id,
          type: 'password_reset',
          token: resetToken,
          expires: tokenExpiry
        }
      });
    }
    
    // 创建重置链接
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    // TODO: 发送邮件功能（暂未实现）
    console.log('密码重置链接:', resetUrl);
    
    return NextResponse.json(
      { success: true, message: '如果该邮箱已注册，您将收到重置密码的链接' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('忘记密码API错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
} 