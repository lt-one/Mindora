/**
 * 单个用户管理API路由
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { hashPassword } from '@/lib/auth/bcrypt';

/**
 * GET: 获取单个用户信息
 */
export async function GET(
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
    
    // 查询用户
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT: 更新用户信息
 */
export async function PUT(
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
    const data = await request.json();
    const { name, email, role, bio, image, isActive } = data;
    
    // 查询用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 如果要修改邮箱，检查邮箱是否已被其他用户使用
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { error: '该邮箱已被其他用户注册' },
          { status: 400 }
        );
      }
    }
    
    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
        role: role !== undefined ? role : undefined,
        bio: bio !== undefined ? bio : undefined,
        image: image !== undefined ? image : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true
      }
    });
    
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 删除用户
 */
export async function DELETE(
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
    
    // 防止删除自己
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: '不能删除当前登录的用户' },
        { status: 400 }
      );
    }
    
    // 查询用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 删除用户
    await prisma.user.delete({
      where: { id: userId }
    });
    
    return NextResponse.json(
      { message: '用户已成功删除' },
      { status: 200 }
    );
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    );
  }
} 