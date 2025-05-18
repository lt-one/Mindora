import { NextResponse } from 'next/server';
import { getAllProjects, getProjectBySlug } from '@/lib/api/projects';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request
) {
  try {
    // 解析URL获取查询参数
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const count = searchParams.get('count');
    
    // 如果请求的是计数，返回项目总数
    if (count === 'true') {
      const projectCount = await prisma.project.count();
      
      return NextResponse.json({
        success: true,
        data: { count: projectCount }
      }, { status: 200 });
    }
    
    // 如果提供了slug参数，返回单个项目
    if (slug) {
      const project = await getProjectBySlug(slug);
      
      if (!project) {
        return NextResponse.json(
          { success: false, error: `没有找到slug为 ${slug} 的项目` },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: project
      });
    }
    
    // 否则返回所有项目
    const projects = await getAllProjects();
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('项目API请求处理出错:', error);
    return NextResponse.json(
      { success: false, error: '获取项目数据时出错' },
      { status: 500 }
    );
  }
} 