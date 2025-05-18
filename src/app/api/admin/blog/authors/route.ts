/**
 * 博客作者API路由
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAllAuthors } from '@/lib/api/admin/blog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

/**
 * GET: 获取所有可用的作者列表
 */
export async function GET(request: NextRequest) {
  try {
    // 验证用户权限，只有管理员可以访问
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '无权限访问此API' },
        { status: 403 }
      );
    }
    
    // 获取所有作者
    const authors = await getAllAuthors();
    
    return NextResponse.json({
      success: true,
      data: { authors }
    }, { status: 200 });
  } catch (error) {
    console.error('获取作者列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取作者列表失败' },
      { status: 500 }
    );
  }
} 