/**
 * 重置密码API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/bcrypt';

export async function POST(request: Request) {
  try {
    // 获取请求数据
    const body = await request.json();
    const { token, password } = body;
    
    // 验证必填字段
    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: '令牌和密码为必填项' },
        { status: 400 }
      );
    }
    
    // 验证密码长度
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: '密码长度必须至少为8个字符' },
        { status: 400 }
      );
    }
    
    // 查找验证记录
    const verification = await prisma.verification.findUnique({
      where: { token },
      include: { user: true }
    });
    
    // 验证记录不存在或已过期
    if (!verification) {
      return NextResponse.json(
        { success: false, message: '无效的重置令牌' },
        { status: 400 }
      );
    }
    
    if (verification.type !== 'password_reset') {
      return NextResponse.json(
        { success: false, message: '无效的重置令牌类型' },
        { status: 400 }
      );
    }
    
    if (verification.expires < new Date()) {
      return NextResponse.json(
        { success: false, message: '重置令牌已过期，请重新申请' },
        { status: 400 }
      );
    }
    
    // 加密新密码
    const hashedPassword = await hashPassword(password);
    
    // 更新用户密码
    await prisma.user.update({
      where: { id: verification.userId },
      data: { password: hashedPassword }
    });
    
    // 删除验证记录
    await prisma.verification.delete({
      where: { id: verification.id }
    });
    
    return NextResponse.json(
      { success: true, message: '密码已成功重置' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('重置密码API错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
} 