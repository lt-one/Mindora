"use client";

import { useState, useEffect } from "react";
import { Grid2X2, List, ChevronDown, ChevronUp } from "lucide-react";
import { BlogPost } from "@/types/blog";
import BlogPostCard from "./BlogPostCard";

interface BlogListProps {
  posts: BlogPost[];
  showViewToggle?: boolean;
  initialViewMode?: "grid" | "list";
}

export default function BlogList({ 
  posts, 
  showViewToggle = true,
  initialViewMode = "grid" 
}: BlogListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode);
  const [showAllPosts, setShowAllPosts] = useState<boolean>(false);
  
  // 网格视图的配置
  const gridPostsPerRow = 3;
  const gridDefaultRows = 3;
  const gridDefaultVisibleCount = gridDefaultRows * gridPostsPerRow;
  
  // 列表视图的配置
  const listDefaultVisibleCount = 5; // 列表视图默认显示5篇文章
  
  // 根据当前视图模式确定要显示的文章数量
  const getVisiblePostsCount = () => {
    if (viewMode === 'grid') {
      return gridDefaultVisibleCount;
    } else {
      return listDefaultVisibleCount;
    }
  };
  
  // 计算当前应该显示的文章
  const visiblePosts = !showAllPosts && posts.length > getVisiblePostsCount()
    ? posts.slice(0, getVisiblePostsCount())
    : posts;
  
  // 加载保存的视图模式
  useEffect(() => {
    try {
      const savedViewMode = localStorage.getItem('blogViewMode');
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        setViewMode(savedViewMode as 'grid' | 'list');
      }
    } catch (e) {
      console.error('无法访问localStorage', e);
    }
  }, []);
  
  // 保存视图模式到localStorage
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    // 获取当前滚动位置，以便在视图切换后恢复
    const currentScrollPosition = window.scrollY;
    
    setViewMode(mode);
    // 切换视图模式时，重置为默认显示状态
    setShowAllPosts(false);
    
    try {
      localStorage.setItem('blogViewMode', mode);
    } catch (e) {
      console.error('无法保存到localStorage', e);
    }
    
    // 使用setTimeout确保在视图更新后恢复滚动位置
    setTimeout(() => {
      window.scrollTo({
        top: currentScrollPosition,
        behavior: 'auto' // 使用'auto'而不是'smooth'以避免用户察觉到滚动
      });
    }, 0);
  };
  
  // 切换显示全部/收起文章
  const toggleShowAllPosts = () => {
    console.log('toggleShowAllPosts被点击', !showAllPosts); // 添加调试日志
    setShowAllPosts(!showAllPosts);
    // 移除自动滚动到顶部的行为，让用户保持在当前位置
    // 如果将来需要定位到某个位置，可以使用DOM ref或滚动到特定元素
  };
  
  // 空状态处理
  if (posts.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">暂无文章</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          当前没有找到符合条件的文章。请尝试更改筛选条件或稍后再查看。
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* 视图切换按钮组 */}
      {showViewToggle && (
        <div className="flex justify-end mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex shadow-sm">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`flex items-center justify-center p-2 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              } transition-colors`}
              aria-label="网格视图"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`flex items-center justify-center p-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              } transition-colors`}
              aria-label="列表视图"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* 文章列表 */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1'
      } transition-all duration-500`}>
        {visiblePosts.map((post) => (
          <BlogPostCard 
            key={post.id} 
            post={post} 
            viewMode={viewMode}
            showExcerpt={true}
          />
        ))}
      </div>
      
      {/* 加载更多按钮或收起按钮 - 当文章数量超过默认显示数量时显示 */}
      {posts.length > getVisiblePostsCount() && (
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
      
      {/* 调试信息 - 帮助检查问题，可以在解决后移除 */}
      <div className="mt-4 text-xs text-gray-400" style={{ display: 'none' }}>
        总文章数: {posts.length}, 
        当前显示: {visiblePosts.length}, 
        阈值: {getVisiblePostsCount()}, 
        显示全部: {showAllPosts ? '是' : '否'}
      </div>
    </div>
  );
} 