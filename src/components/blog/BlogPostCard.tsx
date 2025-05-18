"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Calendar, Clock, Eye } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/utils";

interface BlogPostCardProps {
  post: BlogPost;
  viewMode?: "grid" | "list";
  showExcerpt?: boolean;
}

export default function BlogPostCard({ 
  post, 
  viewMode = "grid", 
  showExcerpt = true 
}: BlogPostCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const isListView = viewMode === "list";
  
  // 格式化发布日期
  const formattedDate = formatDate(post.publishedAt);
  
  return (
    <article
      className={`group relative flex ${isListView ? 'flex-row' : 'flex-col'} overflow-hidden rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-blue-200 dark:hover:border-blue-700`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 闪光效果 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur transition-all duration-500 group-hover:duration-200 animate-tilt"></div>
      
      {/* 文章缩略图 */}
      <div className={`relative ${isListView ? 'w-1/3 h-40 md:h-52 lg:h-64' : 'w-full aspect-[16/9]'} overflow-hidden`}>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes={isListView ? "33vw" : "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"}
          quality={85}
        />
        
        {/* 精选文章标记 */}
        {post.featured && (
          <div className={`absolute top-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium py-1 px-2.5 rounded-br-lg z-10`}>
            精选
          </div>
        )}
        
        {/* 日期信息 - 移至右上角带有半透明背景 */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg border border-gray-100 dark:border-gray-700 shadow-md">
            <Calendar className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {/* 分类标签 - 移至图片底部，背景渐变增强可读性 */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent z-10">
          <div className="flex flex-wrap gap-1.5 items-center">
            {post.categories.slice(0, isListView ? 2 : 3).map((categorySlug, index) => (
              <Link
                key={index}
                href={`/blog/category/${categorySlug}`}
                className="px-2 py-1 text-xs font-medium bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-md border border-gray-100/30 dark:border-gray-700/30 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                {categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* 文章信息 */}
      <div className={`flex flex-col flex-grow p-5 ${isListView ? 'w-2/3' : 'w-full'}`}>
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {post.title}
          </h3>
        </div>
        
        {/* 文章元数据 */}
        <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.viewCount}次阅读</span>
          </div>
        </div>
        
        {/* 文章摘要 */}
        {showExcerpt && (
          <p className={`text-sm text-gray-600 dark:text-gray-300 mb-4 ${isListView ? 'line-clamp-3' : 'line-clamp-2'} flex-grow`}>
            {post.excerpt}
          </p>
        )}
        
        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {post.tags.slice(0, 3).map((tag, index) => {
            // 直接基于标签名称创建slug
            const tagSlug = tag.replace(/ /g, '-').toLowerCase();
            
            return (
              <Link
                key={index}
                href={`/blog/tag/${tagSlug}`}
                className="px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
              >
                #{tag}
              </Link>
            );
          })}
          {post.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          {/* 作者信息 */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span>{post.author.name}</span>
          </div>
          
          {/* 阅读按钮 */}
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300"
          >
            阅读全文
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}