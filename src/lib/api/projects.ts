import { prisma } from '@/lib/db/prisma';
import type { Project as ProjectType, ProjectCategory, TechnologyTag } from '@/types/project';
import { projects as staticProjects, categories as staticCategories, technologies as staticTechTags } from '@/lib/data/projects';
import { Prisma } from '@prisma/client';

/**
 * 将数据库项目模型映射为前端项目类型
 */
export function mapProjectFromDB(dbProject: any): ProjectType {
  // 解析JSON字段
  const technologies = typeof dbProject.technologies === 'string'
    ? JSON.parse(dbProject.technologies as string)
    : (dbProject.technologies || []);
  
  const categories = typeof dbProject.categories === 'string'
    ? JSON.parse(dbProject.categories as string)
    : (dbProject.categories || []);
  
  const images = typeof dbProject.images === 'string'
    ? JSON.parse(dbProject.images as string)
    : (dbProject.images || []);
  
  const challenges = typeof dbProject.challenges === 'string'
    ? JSON.parse(dbProject.challenges as string)
    : (dbProject.challenges || []);
  
  const solutions = typeof dbProject.solutions === 'string'
    ? JSON.parse(dbProject.solutions as string)
    : (dbProject.solutions || []);
  
  const results = typeof dbProject.results === 'string'
    ? JSON.parse(dbProject.results as string)
    : (dbProject.results || []);
  
  const relatedProjects = typeof dbProject.relatedProjects === 'string'
    ? JSON.parse(dbProject.relatedProjects as string)
    : (dbProject.relatedProjects || []);
  
  const relatedPosts = typeof dbProject.relatedPosts === 'string'
    ? JSON.parse(dbProject.relatedPosts as string)
    : (dbProject.relatedPosts || []);

  return {
    id: dbProject.id,
    title: dbProject.title,
    slug: dbProject.slug,
    summary: dbProject.summary,
    description: dbProject.description,
    thumbnailUrl: dbProject.thumbnailUrl,
    images: images,
    videoUrl: dbProject.videoUrl || undefined,
    demoUrl: dbProject.demoUrl || undefined,
    sourceCodeUrl: dbProject.sourceCodeUrl || undefined,
    technologies: technologies,
    categories: categories,
    featured: Boolean(dbProject.featured),
    highlightColor: dbProject.highlightColor || undefined,
    completionDate: dbProject.completionDate || '',
    duration: dbProject.duration || undefined,
    role: dbProject.role || undefined,
    client: dbProject.client || undefined,
    challenges: challenges,
    solutions: solutions,
    results: results,
    relatedProjects: relatedProjects,
    relatedPosts: relatedPosts,
    order: dbProject.order || 0
  };
}

/**
 * 获取所有项目
 */
export async function getAllProjects(): Promise<ProjectType[]> {
  try {
    // 尝试从数据库获取所有项目
    const dbProjects = await prisma.project.findMany({
      orderBy: [
        { createdAt: 'desc' }
      ]
    });
    
    // 如果有数据，映射并返回
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map(project => mapProjectFromDB(project));
    }
    
    // 数据库没有数据，返回静态数据
    console.log('没有找到项目数据，返回静态数据');
    return staticProjects;
  } catch (error) {
    // 出错时记录并返回静态数据
    console.error('获取项目时出错:', error);
    return staticProjects;
  }
}

/**
 * 根据slug获取单个项目
 */
export async function getProjectBySlug(slug: string): Promise<ProjectType | undefined> {
  try {
    // 尝试从数据库获取项目
    const dbProject = await prisma.project.findFirst({
      where: { 
        title: { not: '' }, // 使用一个总是为真的条件
        AND: [
          { slug: slug } as any // 类型断言
        ]
      }
    });
    
    // 如果找到，映射并返回
    if (dbProject) {
      return mapProjectFromDB(dbProject);
    }
    
    // 数据库没有找到，从静态数据中寻找
    console.log(`没有找到slug为 ${slug} 的项目，查找静态数据`);
    return staticProjects.find(p => p.slug === slug);
  } catch (error) {
    // 出错时记录并从静态数据查找
    console.error(`获取slug为 ${slug} 的项目时出错:`, error);
    return staticProjects.find(p => p.slug === slug);
  }
}

/**
 * 获取精选项目
 */
export async function getFeaturedProjects(): Promise<ProjectType[]> {
  try {
    // 尝试从数据库获取精选项目
    const dbProjects = await prisma.project.findMany({
      where: { 
        title: { not: '' }, // 使用一个总是为真的条件
        AND: [
          { featured: true } as any // 类型断言
        ]
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });
    
    // 如果有数据，映射并返回
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map(project => mapProjectFromDB(project));
    }
    
    // 数据库没有数据，返回静态数据中的精选项目
    console.log('没有找到精选项目数据，返回静态数据');
    return staticProjects.filter(p => p.featured);
  } catch (error) {
    // 出错时记录并返回静态数据中的精选项目
    console.error('获取精选项目时出错:', error);
    return staticProjects.filter(p => p.featured);
  }
}

/**
 * 按分类获取项目
 */
export async function getProjectsByCategory(categorySlug: string): Promise<ProjectType[]> {
  try {
    // 尝试从数据库获取所有项目
    const allProjects = await prisma.project.findMany();
    
    // 如果有数据，过滤包含指定分类的项目
    if (allProjects && allProjects.length > 0) {
      // 映射为前端类型
      const mappedProjects = allProjects.map(project => mapProjectFromDB(project));
      
      // 过滤包含指定分类的项目
      return mappedProjects.filter(project => 
        project.categories.includes(categorySlug)
      );
    }
    
    // 数据库没有数据，返回静态数据中符合条件的项目
    console.log(`没有找到分类为 ${categorySlug} 的项目，返回静态数据`);
    return staticProjects.filter(p => p.categories.includes(categorySlug));
  } catch (error) {
    // 出错时记录并返回静态数据中符合条件的项目
    console.error(`获取分类为 ${categorySlug} 的项目时出错:`, error);
    return staticProjects.filter(p => p.categories.includes(categorySlug));
  }
}

/**
 * 按技术标签获取项目
 */
export async function getProjectsByTechnology(technologyName: string): Promise<ProjectType[]> {
  try {
    // 尝试从数据库获取所有项目
    const allProjects = await prisma.project.findMany();
    
    // 如果有数据，过滤包含指定技术的项目
    if (allProjects && allProjects.length > 0) {
      // 映射为前端类型
      const mappedProjects = allProjects.map(project => mapProjectFromDB(project));
      
      // 过滤包含指定技术的项目
      return mappedProjects.filter(project => 
        project.technologies.includes(technologyName)
      );
    }
    
    // 数据库没有数据，返回静态数据中符合条件的项目
    console.log(`没有找到使用 ${technologyName} 的项目，返回静态数据`);
    return staticProjects.filter(p => p.technologies.includes(technologyName));
  } catch (error) {
    // 出错时记录并返回静态数据中符合条件的项目
    console.error(`获取使用 ${technologyName} 的项目时出错:`, error);
    return staticProjects.filter(p => p.technologies.includes(technologyName));
  }
}

/**
 * 获取相关项目
 */
export async function getRelatedProjects(projectId: string, limit: number = 3): Promise<ProjectType[]> {
  try {
    // 先获取当前项目
    const currentProject = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!currentProject) {
      // 如果找不到当前项目，返回静态数据中的相关项目
      const staticProject = staticProjects.find(p => p.id === projectId);
      if (staticProject && staticProject.relatedProjects) {
        const relatedIds = typeof staticProject.relatedProjects === 'string'
          ? JSON.parse(staticProject.relatedProjects as string)
          : staticProject.relatedProjects;
          
        return staticProjects
          .filter(p => relatedIds.includes(p.id))
          .slice(0, limit);
      }
      return [];
    }
    
    // 使用类型断言解决类型错误
    const projectWithRelations = currentProject as unknown as {
      id: string;
      relatedProjects: string | any[];
      categories: string | any[];
    };
    
    // 解析相关项目ID
    const relatedIds = typeof projectWithRelations.relatedProjects === 'string'
      ? JSON.parse(projectWithRelations.relatedProjects as string)
      : (projectWithRelations.relatedProjects || []);
    
    if (relatedIds.length === 0) {
      // 如果没有明确指定的相关项目，根据分类查找
      const currentCategories = typeof projectWithRelations.categories === 'string'
        ? JSON.parse(projectWithRelations.categories as string)
        : (projectWithRelations.categories || []);
      
      // 查找拥有相同分类的项目
      const relatedByCategory = await prisma.project.findMany({
        where: {
          id: { not: projectId } // 排除当前项目
        },
        take: limit
      });
      
      if (relatedByCategory.length > 0) {
        // 如果找到，映射并返回
        return relatedByCategory.map(project => mapProjectFromDB(project));
      }
      
      // 返回静态数据中的相关项目
      return staticProjects
        .filter(p => p.id !== projectId && p.categories.some(cat => currentCategories.includes(cat)))
        .slice(0, limit);
    }
    
    // 有明确指定的相关项目，查找这些项目
    const relatedProjects = await prisma.project.findMany({
      where: {
        id: { in: relatedIds as string[] }
      }
    });
    
    // 映射并返回
    return relatedProjects.map(project => mapProjectFromDB(project));
  } catch (error) {
    // 出错时记录并从静态数据查找相关项目
    console.error(`获取项目ID为 ${projectId} 的相关项目时出错:`, error);
    
    // 从静态数据中查找当前项目
    const staticProject = staticProjects.find(p => p.id === projectId);
    if (staticProject && staticProject.relatedProjects) {
      // 查找静态数据中的相关项目
      return staticProjects
        .filter(p => staticProject.relatedProjects!.includes(p.id))
        .slice(0, limit);
    }
    
    return [];
  }
}

/**
 * 获取所有项目分类
 */
export function getAllCategories(): ProjectCategory[] {
  // 对于分类，直接使用静态数据
  // 未来可扩展为从数据库获取
  return staticCategories;
}

/**
 * 获取所有技术标签
 */
export function getAllTechnologies(): TechnologyTag[] {
  // 对于技术标签，直接使用静态数据
  // 未来可扩展为从数据库获取
  return staticTechTags;
} 