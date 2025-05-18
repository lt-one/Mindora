'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SiteGrid from '@/components/good-sites/SiteGrid';
import { Filter } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface SiteGridContainerProps {
  categories: string[];
}

export default function SiteGridContainer({ categories }: SiteGridContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(
    urlCategory && categories.includes(urlCategory) ? urlCategory : "all"
  );
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 当URL参数变化时更新选中的分类
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    } else if (!category) {
      setSelectedCategory("all");
    }
  }, [searchParams, categories]);
  
  // 从API获取站点数据
  useEffect(() => {
    async function fetchSites() {
      setIsLoading(true);
      try {
        // 根据分类筛选构建API URL
        const apiUrl = selectedCategory && selectedCategory !== 'all' 
          ? `/api/good-sites?category=${encodeURIComponent(selectedCategory)}`
          : '/api/good-sites';
          
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.success) {
          setSites(data.data);
        } else {
          console.error('获取站点数据失败:', data.error);
          setSites([]);
        }
      } catch (error) {
        console.error('获取站点数据出错:', error);
        setSites([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSites();
  }, [selectedCategory]);
  
  // 点击分类标签时的处理
  const handleCategoryClick = (category: string) => {
    if (category === 'all') {
      // 清除查询参数
      router.push('/good-sites');
    } else {
      // 设置分类查询参数
      router.push(`/good-sites?category=${encodeURIComponent(category)}`);
    }
    setSelectedCategory(category);
  };
  
  return (
    <section className="mb-8 relative overflow-visible">
      <div className="p-6 rounded-xl max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <h2 
            className="text-lg font-semibold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}
          >
            分类筛选
          </h2>
        </div>
        
        {/* 分类标签列表 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge 
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`cursor-pointer px-4 py-1.5 text-sm transition-colors duration-200 hover:no-underline ${
              selectedCategory === "all" 
                ? "" 
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            onClick={() => handleCategoryClick("all")}
          >
            全部
          </Badge>
          
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer px-4 py-1.5 text-sm transition-colors duration-200 hover:no-underline ${
                selectedCategory === category 
                  ? "" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        {/* 站点网格展示 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="loading-spinner w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          sites.length > 0 ? (
            <SiteGrid sites={sites} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">没有找到符合条件的站点</p>
            </div>
          )
        )}
      </div>
    </section>
  );
} 