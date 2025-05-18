/**
 * 切换用户状态API路由
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

/**
 * POST: 切换用户激活/禁用状态
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
    
    // 防止修改自己的状态
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: '不能修改当前登录用户的状态' },
        { status: 400 }
      );
    }
    
    // 查询用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isActive: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 切换状态
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: !user.isActive
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });
    
    return NextResponse.json({
      user: updatedUser,
      message: updatedUser.isActive ? '用户已激活' : '用户已禁用'
    }, { status: 200 });
  } catch (error) {
    console.error('切换用户状态失败:', error);
    return NextResponse.json(
      { error: '切换用户状态失败' },
      { status: 500 }
    );
  }
} 