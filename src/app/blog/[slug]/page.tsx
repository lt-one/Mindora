import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Eye, Tag } from 'lucide-react';
import MarkdownContent from '@/components/blog/MarkdownContent';
import TableOfContents from '@/components/blog/TableOfContents';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { getBlogPostBySlug } from '@/lib/api/blog';
import { getRelatedBlogPosts } from '@/lib/api/blog';
import { formatDate, formatDateTime } from '@/lib/utils';

// 重新定义参数类型并确保与Next.js 15的类型系统兼容
type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

interface BlogPostPageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: '文章未找到 | Mindora',
      description: '抱歉，您请求的文章不存在'
    };
  }
  
  return {
    title: `${post.title} | Mindora`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://mindora.top/blog/${post.slug}`,
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
  // 从API获取文章数据
  const post = await getBlogPostBySlug(params.slug);
  
  // 如果文章不存在，显示404页面
  if (!post) {
    notFound();
  }

  // 获取相关文章
  const relatedPosts = await getRelatedBlogPosts(params.slug, 3);
  
  // 调试输出，查看TOC结构是否正确
  console.log(`[Blog Page] 文章"${post.title}"的目录结构:`, post.toc);
  
  // 格式化日期
  const publishedDate = formatDate(post.publishedAt);
  const updatedDate = formatDate(post.updatedAt);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              </div>
               
              {/* 文章分类和标签 */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((categorySlug, index) => (
                    <Link
                      key={index}
                      href={`/blog/category/${categorySlug}`}
                      className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                    >
                      {categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Link>
                  ))}
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog/tag/${tag.toLowerCase().replace(/ /g, '-')}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5 mr-1" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
               
              {/* 改进后的作者信息 */}
              <div className="flex items-start mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                <div className="flex-shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={70}
                    height={70}
                    className="rounded-full border-2 border-white dark:border-gray-700 shadow-md"
                  />
                </div>
                <div className="ml-5 flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{post.author.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{post.author.bio}</p>
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
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800">
            {/* 文章正文 */}
            <article className="p-6 sm:p-8 md:p-10">
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <MarkdownContent content={post.content} />
              </div>
            </article>
          </div>
          
          {/* 侧边栏 - 只包含目录结构 */}
          <div>
            {post.toc && post.toc.length > 0 ? (
              <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800">
                <TableOfContents 
                  toc={post.toc} 
                  maxHeight="calc(100vh - 150px)" 
                  className="w-full" 
                />
              </div>
            ) : (
              // 如果没有目录，显示一个提示
              <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  本文没有目录结构
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* 相关文章 - 只在有相关文章时显示 */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
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
    </div>
  );
} 