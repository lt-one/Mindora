import React, { Suspense } from 'react';
import { Metadata } from 'next';
import SiteGridContainer from '@/components/good-sites/SiteGridContainer';
import { Compass, Globe, Heart, Filter, Search, Sparkles, ArrowRight, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGoodSiteCategories, getGoodSiteStats } from '@/lib/api/good-sites';

// 服务器组件可以导出metadata
export const metadata: Metadata = {
  title: '好站分享 | Mindora',
  description: '这里汇集了我个人偏好并经常使用的优质网站、实用工具与设计资源，希望能为我的数字生活带来便利和启发。'
};

// 页面组件现在是服务器组件
export default async function GoodSitesPage() {
  // 从API获取站点统计数据
  const statsData = await getGoodSiteStats();
  const categories = await getGoodSiteCategories();

  // 计算站点统计数据
  const totalSites = statsData.totalSites;
  
  // 获取前三个主要分类的站点数量
  const categoryStats = statsData.categoryStats.slice(0, 3);
  
  // 获取免费资源数量
  const freeResourcesCount = statsData.freeResourcesCount;
  
  return (
    <div className="relative min-h-screen">
      {/* 全屏背景容器（将覆盖整个视口，但不包括底部导航栏） */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        {/* 主要渐变背景 */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50/90 via-white/90 to-purple-50/90 dark:from-slate-900/95 dark:via-slate-950/95 dark:to-purple-950/95"></div>
        
        {/* 装饰背景元素 - 增加更多的渐变球体并调整位置 */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '25s' }}></div>
        
        {/* 点阵背景纹理 */}
        <div className="absolute inset-0 opacity-10 dark:opacity-15 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMzQjgyRjYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')]"></div>
      </div>
      
      <main className="py-0 relative z-10">
        {/* 标题区域 - 减小尺寸和占用空间 */}
        <section className="relative mb-4 pt-4 overflow-visible"> 
          <div className="relative max-w-7xl mx-auto px-6 pb-2 rounded-2xl">
            <div className="text-center max-w-3xl mx-auto relative z-10">
              <h1 className="scroll-m-20 text-3xl font-bold tracking-tight mb-2">
                {/* 为标题文字添加文本阴影 */}
                <span 
                  className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent relative"
                  style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}
                >
                  好站分享
                </span>
              </h1>
              {/* 优化分隔线样式 */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-300/70 to-purple-300/70 mx-auto mb-2 rounded-full"></div>
              {/* 为描述文字添加文本阴影 - 减小字体大小 */}
              <p 
                className="text-base text-muted-foreground leading-relaxed"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}
              >
                这里是我个人收集和整理的一些
                <span className="text-blue-600 dark:text-blue-400 font-medium">优质网站</span>、
                <span className="text-green-600 dark:text-green-400 font-medium">实用工具</span>
                与<span className="text-violet-600 dark:text-violet-400 font-medium">设计资源</span>，
                它们在我的工作与学习中带来了不少帮助和灵感。
              </p>
            </div>
          </div>
        </section>
        
        {/* 站点概览统计卡片 - 在标题区域和分类筛选之间 */}
        <section className="mb-6 relative overflow-visible">
          <div className="px-6 rounded-xl max-w-7xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-900/70 p-4 rounded-lg border border-border shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <BarChart className="h-4 w-4 text-blue-500" />
                <h3 className="text-base font-medium">站点概览</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* 总站点数 */}
                <div className="bg-blue-50/80 dark:bg-blue-950/50 rounded-md p-3">
                  <div className="text-xs text-muted-foreground mb-1">总站点数</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSites}</div>
                </div>
                
                {/* 主要分类 */}
                {categoryStats.map((category, index) => {
                  const colorClasses = [
                    "bg-purple-50/80 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400", 
                    "bg-green-50/80 dark:bg-green-950/50 text-green-600 dark:text-green-400",
                    "bg-amber-50/80 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                  ];
                  
                  return (
                    <div key={category.name} className={`rounded-md p-3 ${colorClasses[index % colorClasses.length]}`}>
                      <div className="text-xs text-muted-foreground mb-1">{category.name}</div>
                      <div className={`text-2xl font-bold`}>{category.count}</div>
                    </div>
                  );
                })}
                
                {/* 免费资源数量 */}
                <div className="bg-pink-50/80 dark:bg-pink-950/50 rounded-md p-3">
                  <div className="text-xs text-muted-foreground mb-1">免费资源</div>
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{freeResourcesCount}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 使用客户端组件容器包装分类筛选和站点展示 */}
        <Suspense fallback={
          <div className="flex justify-center items-center py-16">
            <div className="loading-spinner w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        }>
          <SiteGridContainer categories={categories} />
        </Suspense>
      </main>
    </div>
  );
} 