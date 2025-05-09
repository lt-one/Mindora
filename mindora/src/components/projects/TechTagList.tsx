'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TechnologyTag } from '@/types/project';

interface TechTagListProps {
  technologies: TechnologyTag[];
}

export default function TechTagList({ technologies }: TechTagListProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 限制显示的数量，如果展开则显示全部，否则只显示前6个
  const displayedTechnologies = expanded ? technologies : technologies.slice(0, 6);
  
  // 处理技术标签点击
  const handleTechClick = (techName: string) => {
    // 保存当前滚动位置
    const scrollPosition = window.scrollY;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("tech", techName);
    
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    
    // 使用 replace 而不是 push 来避免在历史记录中添加新条目
    router.replace(url, { scroll: false });
    
    // 在路由变更后恢复滚动位置
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* 显示当前应该展示的技术标签 */}
      {displayedTechnologies.map((tech, index) => (
        <button 
          key={index} 
          onClick={() => handleTechClick(tech.name)}
          className="px-3 py-1.5 text-sm rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 transition-all hover:scale-105 hover:shadow-sm cursor-pointer"
        >
          {tech.name}
        </button>
      ))}
      
      {/* 展开/收起按钮 */}
      {technologies.length > 6 && (
        <button
          onClick={(e) => {
            e.preventDefault(); // 防止默认事件
            setExpanded(!expanded);
          }}
          className="px-3 py-1.5 text-sm rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {expanded ? (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              收起
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              +{technologies.length - 6} 更多技术
            </>
          )}
        </button>
      )}
    </div>
  );
} 