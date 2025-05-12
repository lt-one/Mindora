"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BookOpen, Clock, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/utils";

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const [showAllPosts, setShowAllPosts] = useState<boolean>(false);
  
  // 默认显示的文章数量
  const defaultVisibleCount = 9; // 3x3网格
  
  // 计算要显示的文章
  const visiblePosts = !showAllPosts && posts.length > defaultVisibleCount
    ? posts.slice(0, defaultVisibleCount)
    : posts;
  
  // 切换显示全部/收起文章
  const toggleShowAllPosts = () => {
    console.log('BlogGrid-toggleShowAllPosts被点击', !showAllPosts); // 添加调试日志
    setShowAllPosts(!showAllPosts);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post) => (
          <article 
            key={post.id} 
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                
                {/* 分类标签 */}
                {post.categories.length > 0 && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-600/90 text-white rounded-md backdrop-blur-sm">
                      {post.categories[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                )}
              </div>
            </Link>
            
            <div className="p-6">
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {post.readingTime}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    {post.viewCount} 次阅读
                  </span>
                </div>
                <span className="text-xs">
                  {formatDate(post.publishedAt)}
                </span>
              </div>
              
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  阅读更多
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {/* 加载更多按钮 - 当文章数量超过默认显示数量时显示 */}
      {posts.length > defaultVisibleCount && (
        <div className="flex justify-center mt-10 transition-opacity duration-300 relative z-50">
          <button 
            onClick={toggleShowAllPosts}
            style={{ position: 'relative', zIndex: 50 }}
            className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:shadow-md cursor-pointer"
            aria-label={showAllPosts ? "收起文章" : "加载更多文章"}
          >
            {showAllPosts ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                收起文章
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                加载更多文章
              </>
            )}
          </button>
        </div>
      )}
      
      {/* 调试信息 */}
      <div className="mt-4 text-xs text-gray-400" style={{ display: 'none' }}>
        总文章数: {posts.length}, 
        当前显示: {visiblePosts.length}, 
        阈值: {defaultVisibleCount}, 
        显示全部: {showAllPosts ? '是' : '否'}
      </div>
    </div>
  );
} 