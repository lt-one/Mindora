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

export default function TableOfContents({
  toc,
  maxHeight = "calc(100vh - 250px)",
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    if (toc.length === 0) return;
    
    // 如果没有指定初始高亮项，则默认选择第一项
    if (!activeId && toc.length > 0) {
      setActiveId(toc[0].id);
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
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
      
      if (item.children) {
        item.children.forEach((child) => {
          const childElement = document.getElementById(child.id);
          if (childElement) observer.observe(childElement);
        });
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, [toc, activeId]);
  
  // 渲染单个目录项
  const renderTocItem = (item: TOCItem, isChild = false) => {
    const isActive = activeId === item.id;
    
    return (
      <li key={item.id} className={cn("my-1", isChild ? "ml-4" : "")}>
        <a
          href={`#${item.id}`}
          className={cn(
            "block py-1 px-2 text-sm rounded-md transition-colors",
            isActive
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(item.id);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
              window.history.pushState(null, "", `#${item.id}`);
              setActiveId(item.id);
            }
          }}
        >
          <span className="flex items-center">
            <Hash className="w-3 h-3 mr-1.5 flex-shrink-0" />
            <span className="line-clamp-1">{item.text}</span>
          </span>
        </a>
        
        {item.children && item.children.length > 0 && (
          <ul className="mt-1 space-y-1">
            {item.children.map((child) => renderTocItem(child, true))}
          </ul>
        )}
      </li>
    );
  };
  
  if (toc.length === 0) return null;
  
  return (
    <div className={cn("bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm", className)}>
      {/* 目录标题 */}
      <div 
        className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer"
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
          className="p-4"
          style={{ maxHeight, overflowY: "auto" }}
        >
          <ul className="space-y-1">
            {toc.map((item) => renderTocItem(item))}
          </ul>
        </nav>
      </div>
    </div>
  );
} 