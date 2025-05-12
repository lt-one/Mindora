"use client";

import { BookOpen, Tag, PenTool, Sparkles, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchBox from "./SearchBox";

interface BlogHeaderProps {
  totalPosts: number;
  categories: { name: string; slug: string; count?: number }[];
  topTags: { name: string; count: number }[];
}

export default function BlogHeader({
  totalPosts,
  categories,
  topTags,
}: BlogHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 处理分类点击，使用router.push代替Link以便添加scroll: false选项
  const handleCategoryClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    router.push(`/blog/category/${slug}`, { scroll: false });
  };
  
  // 处理标签点击，使用router.push代替Link以便添加scroll: false选项
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    router.push(`/blog?tag=${tag.toLowerCase()}`, { scroll: false });
  };
  
  return (
    <div className="w-full mb-16">
      {/* 主标题区域 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 mb-8">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-purple-500/20 to-transparent"></div>
        
        <div className="relative z-10 max-w-3xl">
          {/* 标题部分 */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-blue-50 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2 text-blue-200" />
            <span>探索创意与技术的交汇</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            技术博客与创意分享
          </h1>
          
          <p className="text-blue-100 text-lg max-w-2xl mb-8 leading-relaxed">
            发现前沿开发技术、设计灵感和行业洞见，提升您的创造力和技术能力。我们分享最新的Web开发趋势、设计模式和实用技巧。
          </p>
          
          {/* 简单统计 */}
          <div className="flex flex-wrap items-center text-blue-100 text-sm gap-4">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1.5" />
              <span>{totalPosts} 篇文章</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-300/50"></div>
            <div className="flex items-center">
              <PenTool className="w-4 h-4 mr-1.5" />
              <span>{categories.length} 个专题</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-300/50"></div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1.5" />
              <span>{topTags.length} 个标签</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 分类标签区域 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 搜索框 */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-500" />
            搜索文章
          </h3>
          <div className="flex-grow">
            <SearchBox 
              placeholder="搜索文章标题、内容或标签..." 
              paramName="q"
              className="w-full"
            />
          </div>
        </div>
        
        {/* 热门分类 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <PenTool className="w-5 h-5 mr-2 text-purple-500" />
            热门分类
          </h3>
          <div className="flex-grow">
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((category, index) => (
                <a 
                  key={category.slug} 
                  href={`/blog/category/${category.slug}`}
                  onClick={(e) => handleCategoryClick(e, category.slug)}
                  className="cursor-pointer"
                >
                  <Badge 
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors",
                      index % 4 === 0 && "bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-300",
                      index % 4 === 1 && "bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300",
                      index % 4 === 2 && "bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-800/50 dark:text-amber-300",
                      index % 4 === 3 && "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-800/50 dark:text-green-300",
                    )}
                  >
                    {category.name}
                    {category.count && <span className="ml-1.5 text-xs opacity-70">({category.count})</span>}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* 热门标签 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-indigo-500" />
            热门标签
          </h3>
          <div className="flex-grow">
            <div className="flex flex-wrap gap-2">
              {topTags.slice(0, 10).map((tag, index) => (
                <a 
                  key={tag.name} 
                  href={`/blog?tag=${tag.name.toLowerCase()}`}
                  onClick={(e) => handleTagClick(e, tag.name.toLowerCase())}
                  className="cursor-pointer"
                >
                  <Badge 
                    variant="outline"
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 cursor-pointer"
                  >
                    #{tag.name}
                    <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">({tag.count})</span>
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 