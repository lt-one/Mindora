"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, List, Hash } from "lucide-react";
import { TOCItem } from "@/types/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  toc: TOCItem[];
  maxHeight?: string;
  className?: string;
}

/**
 * 生成一个安全有效的ID，处理空ID的情况
 */
function getSafeId(id: string | undefined, fallback: string): string {
  if (!id || id.trim() === '') {
    // 如果ID为空，使用标题文本生成ID
    return fallback
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^-|-$/g, '') || `heading-${Date.now()}`;
  }
  return id;
}

export default function TableOfContents({
  toc,
  maxHeight = "calc(100vh - 250px)",
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    if (toc.length === 0) return;
    
    // 从URL中获取当前哈希
    const hash = window.location.hash.substring(1);
    
    // 如果URL中有哈希值，则选择该项
    if (hash) {
      setActiveId(hash);
    }
    // 否则，如果没有指定初始高亮项，则默认选择第一项
    else if (!activeId && toc.length > 0) {
      // 确保第一项有ID
      const firstItemId = getSafeId(toc[0].id, toc[0].text);
      setActiveId(firstItemId);
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.1,
      }
    );
    
    // 监听所有标题元素
    toc.forEach((item) => {
      const safeId = getSafeId(item.id, item.text);
      const element = document.getElementById(safeId);
      if (element) observer.observe(element);
      
      if (item.children) {
        item.children.forEach((child) => {
          const safeChildId = getSafeId(child.id, child.text);
          const childElement = document.getElementById(safeChildId);
          if (childElement) observer.observe(childElement);
        });
      }
    });
    
    // 监听哈希变化事件
    const handleHashChange = () => {
      const newHash = window.location.hash.substring(1);
      if (newHash) {
        setActiveId(newHash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [toc, activeId]);
  
  // 渲染单个目录项
  const renderTocItem = (item: TOCItem, isChild = false) => {
    // 确保ID安全有效
    const safeId = getSafeId(item.id, item.text);
    const isActive = activeId === safeId;
    
    return (
      <li key={safeId} className={cn("my-1.5", isChild ? "ml-5" : "")}>
        <a
          href={`#${safeId}`}
          className={cn(
            "block py-1.5 px-3 rounded-md transition-colors border-l-2",
            isActive
              ? "bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium border-l-blue-500 dark:border-l-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-600"
          )}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(safeId);
            if (element) {
              // 滚动到元素位置
              element.scrollIntoView({ behavior: "smooth" });
              
              // 更新URL哈希
              window.history.pushState(null, "", `#${safeId}`);
              
              // 设置活动ID
              setActiveId(safeId);
              
              // 可选：添加高亮动画
              element.classList.add('bg-yellow-100');
              setTimeout(() => {
                element.classList.remove('bg-yellow-100');
              }, 1500);
            }
          }}
        >
          <span className="flex items-center">
            <Hash className="w-3 h-3 mr-2 flex-shrink-0 opacity-70" />
            <span className="line-clamp-1">{item.text}</span>
          </span>
        </a>
        
        {item.children && item.children.length > 0 && (
          <ul className="mt-1.5 space-y-1.5 border-l border-gray-100 dark:border-gray-700">
            {item.children.map((child) => renderTocItem(child, true))}
          </ul>
        )}
      </li>
    );
  };
  
  // 如果没有目录项，不显示组件
  if (!toc || toc.length === 0) return null;
  
  return (
    <div className={cn("bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800", className)}>
      {/* 目录标题 */}
      <div 
        className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between cursor-pointer bg-gray-50/80 dark:bg-gray-800/50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
          <List className="w-4 h-4 mr-2 text-blue-500" />
          文章目录
        </h3>
        <button
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
      
      {/* 目录内容 */}
      <div className={cn(isCollapsed ? "hidden" : "block")}>
        <nav 
          className="p-3"
          style={{ maxHeight, overflowY: "auto" }}
        >
          <ul className="space-y-1.5">
            {toc.map((item) => renderTocItem(item))}
          </ul>
        </nav>
      </div>
    </div>
  );
} 