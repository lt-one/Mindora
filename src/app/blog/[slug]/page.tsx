import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  getBlogPostBySlug, 
  getRelatedBlogPosts 
} from "@/lib/data/blog";
import { formatDateTime } from "@/lib/utils";
import { Calendar, Clock, Eye, Heart, Tag, ArrowLeft, Share2 } from "lucide-react";
import MarkdownContent from "@/components/blog/MarkdownContent";
import TableOfContents from "@/components/blog/TableOfContents";
import BlogPostCard from "@/components/blog/BlogPostCard";

// 重新定义参数类型并确保与Next.js 15的类型系统兼容
type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

interface BlogPostPageProps {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // 正确处理异步params
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: "文章未找到 | Mindora",
      description: "抱歉，您请求的文章不存在。",
    };
  }
  
  return {
    title: `${post.title} | Mindora博客`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://Mindora.dev/blog/${post.slug}`,
      siteName: "Mindora",
      locale: "zh_CN",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: BlogPostPageProps) {
  // 正确处理异步params
  const resolvedParams = await params;
  // 在需要使用searchParams时需要await
  await searchParams;
  
  const post = await getBlogPostBySlug(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }
  
  // 获取相关文章
  const relatedPosts = await getRelatedBlogPosts(resolvedParams.slug, 3);
  
  // 格式化时间
  const publishedDate = formatDateTime(post.publishedAt);
  const updatedDate = formatDateTime(post.updatedAt);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* 博客文章头部 */}
      <div className="relative">
        {/* 封面图 */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover brightness-[0.85] dark:brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        </div>
        
        {/* 标题和元信息 */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative -mt-40 md:-mt-56 z-10">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10">
              {/* 返回按钮 */}
              <Link
                href="/blog"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回博客列表
              </Link>
              
              {/* 文章标题 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {post.title}
              </h1>
              
              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>发布于 {publishedDate}</span>
                </div>
                {post.updatedAt !== post.publishedAt && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>更新于 {updatedDate}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{post.readingTime}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{post.viewCount}次阅读</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  <span>{post.likeCount}次点赞</span>
                </div>
              </div>
              
              {/* 文章分类和标签 */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((categorySlug, index) => (
                    <Link
                      key={index}
                      href={`/blog?category=${categorySlug}`}
                      className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                    >
                      {categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Link>
                  ))}
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog?tag=${tag.toLowerCase().replace(/ /g, '-')}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5 mr-1" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* 作者信息 */}
              <div className="flex items-center mb-8 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">{post.author.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.author.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 文章内容区域 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* 主要内容 */}
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-md p-6 sm:p-8 md:p-10 border border-gray-100 dark:border-gray-800">
            {/* 文章正文 */}
            <article className="mb-10">
              <MarkdownContent content={post.content} />
            </article>
            
            {/* 分享和点赞 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-10">
              <div className="flex flex-wrap justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">分享这篇文章</h3>
                  <div className="flex space-x-3">
                    <button className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    {/* 可添加其他社交分享按钮 */}
                  </div>
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>点赞 ({post.likeCount})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:space-y-6">
            {/* 目录 */}
            {post.toc && post.toc.length > 0 && (
              <div className="sticky top-20">
                <TableOfContents toc={post.toc} />
              </div>
            )}
          </div>
        </div>
        
        {/* 相关文章 */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-md p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 h-6 w-1 rounded-full mr-3"></span>
                相关文章
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard 
                    key={relatedPost.id} 
                    post={relatedPost} 
                    showExcerpt={false} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 