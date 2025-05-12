import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { 
  categories as originalCategories, 
  tags as originalTags, 
  getAllBlogPosts
} from "@/lib/data/blog";
import BlogFilter from "@/components/blog/BlogFilter";
import BlogList from "@/components/blog/BlogList";
import { ArrowLeft, BookOpen, ChevronRight, Search } from "lucide-react";
import { BlogCategory, BlogTag } from "@/types/blog";

// 定义参数类型为Promise，符合Next.js 15的要求
type SearchParams = Promise<{ tag?: string; q?: string }>;

interface AllBlogPageProps {
  searchParams: SearchParams;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `所有博客文章 | Mindora`,
    description: "浏览所有博客文章和教程",
    openGraph: {
      title: `所有博客文章 | Mindora`,
      description: "浏览所有博客文章和教程",
      url: `https://Mindora.dev/blog/all`,
      siteName: "Mindora",
      locale: "zh_CN",
      type: "website",
    },
  };
}

export default async function AllBlogPage({ searchParams }: AllBlogPageProps) {
  const searchParamsData = await searchParams;
  
  const tagParam = searchParamsData?.tag?.toString() || "all";
  const searchQuery = searchParamsData?.q?.toString() || "";
  
  // 获取所有博客文章
  const allPosts = await getAllBlogPosts();
  
  // 动态计算每个分类的文章数量
  const categories: BlogCategory[] = originalCategories.map(cat => {
    const categoryPosts = allPosts.filter(post => post.categories.includes(cat.slug));
    return {
      ...cat,
      count: categoryPosts.length // 用实际数量替换硬编码的数量
    };
  });
  
  // 动态计算每个标签的文章数量
  const tags: BlogTag[] = originalTags.map(tag => {
    // 计算具有该标签的文章数量
    const tagPosts = allPosts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase().replace(/ /g, '-') === tag.slug)
    );
    return {
      ...tag,
      count: tagPosts.length // 用实际数量替换硬编码的数量
    };
  });
  
  const getFilteredPosts = () => {
    let filteredPosts = allPosts;
    
    if (tagParam !== "all") {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase().replace(/ /g, '-') === tagParam)
      );
    }
    
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
  
  const posts = getFilteredPosts();
  
  // 判断是否有有效的搜索或标签筛选
  const hasActiveFilters = tagParam !== "all" || searchQuery !== "";
  
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="absolute inset-0 bg-grid-pattern opacity-50 dark:opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/0 to-indigo-50/30 dark:from-blue-900/10 dark:via-gray-900/0 dark:to-indigo-900/10"></div>
      
      <div className="absolute left-0 top-0 h-full w-16 md:w-24 lg:w-32 bg-gradient-to-r from-blue-100/40 to-transparent dark:from-blue-900/10 dark:to-transparent -z-5"></div>
      
      <div className="absolute right-0 top-0 h-full w-16 md:w-24 lg:w-32 bg-gradient-to-l from-indigo-100/40 to-transparent dark:from-indigo-900/10 dark:to-transparent -z-5"></div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            博客首页
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-blue-600 dark:text-blue-400 font-medium">所有博客文章</span>
        </div>
        
        <div className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                所有博客文章
              </h1>
              <div className="ml-3 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                {allPosts.length}篇文章
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              浏览所有博客文章和技术教程，或使用下方筛选功能查找特定主题的内容。
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mb-8">
          <BlogFilter categories={categories} tags={tags} />
        </div>
        
        {/* 筛选与搜索状态 */}
        {hasActiveFilters && (
          <div className="max-w-7xl mx-auto mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
              <span className="mr-2">
                {searchQuery ? `搜索"${searchQuery}"` : ''}
                {searchQuery && tagParam !== "all" ? ' | ' : ''}
                {tagParam !== "all" ? `标签: ${tags.find(t => t.slug === tagParam)?.name}` : ''}
              </span>
              <span>找到 {posts.length} 篇文章</span>
            </div>
          </div>
        )}
        
        <section className="max-w-7xl mx-auto relative">
          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          }>
            {posts.length > 0 ? (
              <BlogList posts={posts} showViewToggle={true} />
            ) : (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  未找到相关文章
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  没有符合当前搜索或筛选条件的文章。请尝试使用不同的关键词或重置筛选条件。
                </p>
                <Link
                  href="/blog/all"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                >
                  查看所有文章
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  返回博客首页
                </Link>
              </div>
            )}
          </Suspense>
        </section>
        
        <div className="mt-16 relative">
          <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-blue-100/50 dark:fill-blue-900/20">
              <path d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,176C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
} 