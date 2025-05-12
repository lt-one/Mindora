import type { Metadata } from "next";
import { Suspense } from "react";
import { 
  getAllBlogPosts, 
  getBlogPostsByCategory, 
  getBlogPostsByTag,
  getLatestBlogPosts,
  getFeaturedBlogPosts,
  categories as originalCategories, 
  tags as originalTags
} from "@/lib/data/blog";
import BlogFilter from "@/components/blog/BlogFilter";
import BlogList from "@/components/blog/BlogList";
import BlogGrid from "@/components/blog/BlogGrid";
import ResetFilterButton from "@/components/blog/ResetFilterButton";
import FeaturedPostsCarouselShadcn from "@/components/blog/FeaturedPostsCarouselShadcn";
import BlogHeader from "@/components/blog/BlogHeader";
import RecommendedPosts from "@/components/blog/RecommendedPosts";
import { BlogCategory, BlogTag, BlogPost } from "@/types/blog";
import { Search, BookOpen, PenTool, Tag, Award, TrendingUp, Clock, BookMarked, Bookmark, Eye, Hash, BarChart2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "博客文章 | Mindora",
  description: "探索技术文章、学习笔记和项目经验分享，包括前端开发、数据可视化、性能优化等主题",
  keywords: "技术博客, 前端开发, React, Next.js, 数据可视化, 学习笔记",
  openGraph: {
    title: "博客文章 | Mindora",
    description: "探索技术文章、学习笔记和项目经验分享，包括前端开发、数据可视化、性能优化等主题",
    url: "https://Mindora.dev/blog",
    siteName: "Mindora",
    locale: "zh_CN",
    type: "website",
  },
};

// 定义参数类型为Promise，符合Next.js 15的要求
type SearchParams = Promise<{ category?: string; tag?: string; q?: string }>;

interface BlogPageProps {
  searchParams: SearchParams;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // 修复 searchParams 异步使用问题 - 先将 searchParams 完整获取
  const params = await searchParams;
  const category = params?.category?.toString() || "all";
  const tag = params?.tag?.toString() || "all";
  const searchQuery = params?.q?.toString() || "";
  
  // 获取所有博客文章
  const allPosts = await getAllBlogPosts();
  
  // 获取最新的3篇文章用于轮播图
  const latestPosts = await getLatestBlogPosts(4);
  
  // 获取精选文章用于推荐
  const featuredPosts = await getFeaturedBlogPosts();
  
  // 获取浏览量最高的4篇文章
  const popularPosts = allPosts
    .filter(post => post.publishedAt)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 4);
  
  // 动态计算每个分类的文章数量
  const categories: BlogCategory[] = originalCategories.map(cat => {
    const categoryPosts = allPosts.filter(post => post.categories.includes(cat.slug));
    return {
      ...cat,
      count: categoryPosts.length // 用实际数量替换硬编码的数量
    };
  });
  
  // 动态计算每个标签的文章数量
  const tagsWithCount: BlogTag[] = originalTags.map(tag => {
    // 计算具有该标签的文章数量
    const tagPosts = allPosts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase().replace(/ /g, '-') === tag.slug)
    );
    return {
      ...tag,
      count: tagPosts.length // 用实际数量替换硬编码的数量
    };
  });
  
  // 获取筛选后的博客文章
  const getFilteredPosts = async () => {
    let filteredPosts = allPosts;
    
    // 按分类筛选
    if (category !== "all") {
      filteredPosts = await getBlogPostsByCategory(category);
    }
    
    // 按标签筛选
    if (tag !== "all") {
      // 如果已经按分类筛选过，则在结果中进一步筛选
      if (category !== "all") {
        // 找到标签名称
        const tagObj = tagsWithCount.find(t => t.slug === tag);
        if (tagObj) {
          filteredPosts = filteredPosts.filter(post => post.tags.includes(tagObj.name));
        }
      } else {
        filteredPosts = await getBlogPostsByTag(tag);
      }
    }
    
    // 按搜索关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) || 
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filteredPosts;
  };
  
  const posts = await getFilteredPosts();
  
  // 判断是否有有效的搜索或筛选条件
  const hasActiveFilters = category !== "all" || tag !== "all" || searchQuery !== "";
  
  // 计算博客统计数据
  const totalPosts = allPosts.length;
  
  // 获取热门标签（按文章数量排序，最多10个）
  const hotTags = [...tagsWithCount]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 10)
    .map(tag => ({ name: tag.name, count: tag.count || 0 }));
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 主要内容容器 */}
      <div className="container mx-auto px-4 py-10 md:py-12 sm:px-6 lg:px-8">
        {/* 博客头部区域 - 新组件替代原来的统计卡片 */}
        {!hasActiveFilters && (
          <div className="max-w-7xl mx-auto">
            <BlogHeader 
              totalPosts={totalPosts} 
              categories={categories}
              topTags={hotTags}
            />
          </div>
        )}
        
        {/* 轮播图展示最新文章 - 保留原样 */}
        {!hasActiveFilters && (
          <Suspense fallback={
            <div className="w-full h-[400px] rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse mb-8"></div>
          }>
            <div className="mb-12">
              <FeaturedPostsCarouselShadcn posts={latestPosts.slice(0, 3)} />
            </div>
          </Suspense>
        )}
        
        {/* 筛选与搜索状态 */}
        {hasActiveFilters && (
          <div className="max-w-7xl mx-auto mb-8 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span className="mr-2">
                {searchQuery ? `搜索"${searchQuery}"` : ''}
                {searchQuery && (category !== "all" || tag !== "all") ? ' | ' : ''}
                {category !== "all" ? `分类: ${categories.find(c => c.slug === category)?.name}` : ''}
                {category !== "all" && tag !== "all" ? ' | ' : ''}
                {tag !== "all" ? `标签: ${tagsWithCount.find(t => t.slug === tag)?.name}` : ''}
              </span>
              <span>找到 {posts.length} 篇文章</span>
            </div>
              <ResetFilterButton />
            </div>
          </div>
        )}
        
        {/* 博客筛选器 - 当有筛选条件时才显示 */}
        {hasActiveFilters && (
          <div className="max-w-7xl mx-auto mb-8">
            <BlogFilter categories={categories} tags={tagsWithCount} />
          </div>
        )}
        
        {/* 博客文章列表 - 使用新的Grid组件 */}
        <section className="max-w-7xl mx-auto relative mb-16">
          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          }>
            {posts.length > 0 ? (
              <BlogGrid posts={posts} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  未找到相关文章
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  没有符合当前搜索或筛选条件的文章。请尝试使用不同的关键词或重置筛选条件。
                </p>
                <ResetFilterButton />
              </div>
            )}
          </Suspense>
        </section>
        
        {/* 分隔线 */}
        {!hasActiveFilters && posts.length > 0 && (
          <div className="max-w-7xl mx-auto mb-10">
            <Separator className="bg-gray-200 dark:bg-gray-700" />
          </div>
        )}
        
        {/* 推荐文章区域 - 只在没有筛选条件时显示 */}
        {!hasActiveFilters && posts.length > 0 && (
          <div className="max-w-7xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-amber-500" />
              推荐阅读
            </h2>
            <RecommendedPosts
              popularPosts={popularPosts}
              latestPosts={latestPosts}
              featuredPosts={featuredPosts.length > 0 ? featuredPosts : popularPosts}
            />
          </div>
        )}
        
        {/* 订阅区域 */}
        {!hasActiveFilters && (
          <div className="max-w-7xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 p-8 md:p-10 rounded-xl border border-blue-400 dark:border-blue-600 shadow-md text-white">
              <div className="md:flex items-center justify-between">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-2xl font-bold mb-3">订阅博客更新</h3>
                  <p className="text-blue-100 dark:text-blue-200 mb-0">定期获取最新文章、教程和技术动态，不错过任何重要更新</p>
                </div>
                <div className="md:w-1/3">
                  <form className="flex">
                    <input 
                      type="email" 
                      placeholder="您的邮箱地址" 
                      className="flex-grow px-4 py-3 rounded-l-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <button 
                      type="submit" 
                      className="px-5 py-3 bg-white text-blue-700 font-medium rounded-r-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      订阅
                    </button>
                  </form>
                </div>
              </div>
          </div>
        </div>
        )}
      </div>
    </main>
  );
} 