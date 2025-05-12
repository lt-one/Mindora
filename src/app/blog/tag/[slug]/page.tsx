import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  tags as originalTags, 
  categories as originalCategories,
  getBlogPostsByTag,
  getAllBlogPosts
} from "@/lib/data/blog";
import BlogList from "@/components/blog/BlogList";
import { ArrowLeft, Hash, Search } from "lucide-react";
import { BlogCategory, BlogTag } from "@/types/blog";

// 定义参数类型为Promise，符合Next.js 15的要求
type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ q?: string }>;

interface TagPageProps {
  params: Params;
  searchParams: SearchParams;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = originalTags.find(t => t.slug === slug);
  
  if (!tag) {
    return {
      title: "标签未找到 | Mindora",
      description: "抱歉，您请求的标签不存在。",
    };
  }
  
  return {
    title: `#${tag.name} - 博客标签 | Mindora`,
    description: `浏览与${tag.name}相关的所有技术文章和教程`,
    openGraph: {
      title: `#${tag.name} - 博客标签 | Mindora`,
      description: `浏览与${tag.name}相关的所有技术文章和教程`,
      url: `https://Mindora.dev/blog/tag/${tag.slug}`,
      siteName: "Mindora",
      locale: "zh_CN",
      type: "website",
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const searchParamsData = await searchParams;
  
  const tag = originalTags.find(t => t.slug === slug);
  const searchQuery = searchParamsData?.q?.toString() || "";
  
  if (!tag) {
    return notFound();
  }
  
  // 获取所有博客文章
  const allPosts = await getAllBlogPosts();
  
  // 获取当前标签下的所有文章
  const tagPosts = await getBlogPostsByTag(slug);
  
  // 根据搜索条件筛选文章
  const filteredPosts = searchQuery 
    ? tagPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tagPosts;
  
  // 计算每个标签的文章数量
  const tagsWithCount = originalTags.map(tagItem => {
    // 计算具有该标签的文章数量
    const tagItemPosts = allPosts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase().replace(/ /g, '-') === tagItem.slug)
    );
    return {
      ...tagItem,
      count: tagItemPosts.length
    };
  });
  
  // 当前标签，使用实际计算的数量
  const currentTag = tagsWithCount.find(t => t.slug === slug);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回所有文章
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Hash className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">{tag.name}</h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          共 {tagPosts.length} 篇相关文章
        </p>
      </div>
      
      {/* 搜索框 */}
      <div className="mb-6">
        <form 
          method="get"
          className="relative max-w-xl"
        >
          <input
            type="text"
            name="q"
            placeholder={`在 #${tag.name} 标签中搜索...`}
            defaultValue={searchQuery}
            className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 px-3 py-1 bg-blue-600 text-white rounded-md"
          >
            搜索
          </button>
        </form>
      </div>
      
      {/* 搜索状态提示 */}
      {searchQuery && (
        <div className="mb-6 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg inline-flex items-center">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            搜索 "{searchQuery}" 在 #{tag.name} 标签下找到 {filteredPosts.length} 篇文章
          </span>
          <Link
            href={`/blog/tag/${slug}`}
            className="ml-3 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded"
          >
            清除搜索
          </Link>
        </div>
      )}
      
      {filteredPosts.length > 0 ? (
        <BlogList posts={filteredPosts} />
      ) : (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            未找到相关文章
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            在 "#{tag.name}" 标签下没有符合当前搜索条件的文章。请尝试使用不同的关键词。
          </p>
          <Link
            href={`/blog/tag/${slug}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            查看所有标签文章
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            返回博客首页
          </Link>
        </div>
      )}
    </main>
  );
} 