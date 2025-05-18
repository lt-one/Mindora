/**
 * 好站分享API函数
 */
import prisma from '@/lib/db/prisma';

/**
 * 获取所有好站数据
 * @param category 可选的分类筛选
 * @param tag 可选的标签筛选
 * @param featured 是否只返回精选内容
 */
export async function getGoodSites({ 
  category,
  tag,
  featured
}: { 
  category?: string; 
  tag?: string;
  featured?: boolean;
} = {}) {
  try {
    // 构建查询条件
    const whereClause: any = {
      isActive: true,
    };

    // 如果指定了分类，添加分类筛选
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // 如果指定了标签，添加标签筛选（查找JSON数组中包含特定标签的记录）
    if (tag) {
      // 使用JSON_CONTAINS函数查询标签
      // MySQL的JSON_CONTAINS语法不能直接用在Prisma中，需要使用原始SQL
      // 这里使用了简化方案，实际实现可能需要根据数据库类型调整
      whereClause.tags = {
        path: '$',
        array_contains: tag,
      };
    }

    // 如果指定了featured，添加featured筛选
    if (featured !== undefined) {
      whereClause.featured = featured;
    }

    const sites = await prisma.goodSite.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    // 将数据库模型转换为前端组件所需的格式
    return sites.map(site => ({
      id: site.id,
      name: site.name,
      url: site.url,
      description: site.description, 
      logo: '', // 数据库模型中没有这个字段，使用空字符串
      useCases: Array.isArray(site.useCases) ? site.useCases : [],
      recommendReason: site.experience || '',
      tags: Array.isArray(site.tags) ? site.tags : [],
      screenshot: Array.isArray(site.screenshots) && site.screenshots.length > 0 
        ? site.screenshots[0] 
        : '',
      category: site.category,
      isFree: site.isFree,
      hasPremium: site.hasPremium,
      rating: site.rating,
      featured: site.featured,
      viewCount: site.viewCount
    }));
  } catch (error) {
    console.error('获取好站数据失败:', error);
    throw new Error('获取好站数据失败');
  }
}

/**
 * 获取好站分类列表
 */
export async function getGoodSiteCategories() {
  try {
    // 从数据库中获取所有不同的分类
    const categories = await prisma.goodSite.findMany({
      distinct: ['category'],
      select: {
        category: true,
      },
      where: {
        isActive: true,
      },
    });

    return categories.map(item => item.category);
  } catch (error) {
    console.error('获取好站分类失败:', error);
    return [];
  }
}

/**
 * 获取好站统计信息
 */
export async function getGoodSiteStats() {
  try {
    // 获取总站点数
    const totalCount = await prisma.goodSite.count({
      where: { isActive: true },
    });

    // 获取分类统计
    const categoryStats = await prisma.goodSite.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      where: { isActive: true },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 3, // 取前三个主要分类
    });

    // 获取免费资源数量
    const freeCount = await prisma.goodSite.count({
      where: { 
        isActive: true,
        isFree: true,
        hasPremium: false,
      },
    });

    // 将数据转换为前端所需格式
    const stats = {
      totalSites: totalCount,
      categoryStats: categoryStats.map(item => ({
        name: item.category,
        count: item._count.id,
      })),
      freeResourcesCount: freeCount,
    };

    return stats;
  } catch (error) {
    console.error('获取好站统计信息失败:', error);
    // 返回默认数据
    return {
      totalSites: 0,
      categoryStats: [],
      freeResourcesCount: 0,
    };
  }
}

/**
 * 增加站点访问计数
 * @param id 站点ID
 */
export async function incrementSiteViewCount(id: string) {
  try {
    await prisma.goodSite.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    return true;
  } catch (error) {
    console.error(`增加站点访问计数失败:`, error);
    return false;
  }
} 