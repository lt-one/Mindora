"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchHistory, { addSearchToHistory } from "./SearchHistory";

interface SearchBoxProps {
  placeholder?: string;
  paramName?: string;
  className?: string;
}

export default function SearchBox({ 
  placeholder = "搜索文章标题、内容或标签...",
  paramName = "q",
  className = ""
}: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 获取当前搜索参数
  const currentQuery = searchParams.get(paramName) || "";
  
  // 搜索输入
  const [query, setQuery] = useState(currentQuery);
  // 是否显示历史记录
  const [showHistory, setShowHistory] = useState(false);
  // 搜索框引用，用于聚焦操作
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 处理搜索表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  // 执行搜索
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      // 如果查询为空，移除搜索参数
      const params = new URLSearchParams(searchParams.toString());
      params.delete(paramName);
      router.push(`${pathname}?${params.toString()}`);
      return;
    }

    // 更新URL参数
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, searchQuery);
    router.push(`${pathname}?${params.toString()}`);
    
    // 添加到搜索历史
    addSearchToHistory(searchQuery);
    
    // 隐藏历史记录
    setShowHistory(false);
  };

  // 处理搜索历史项点击
  const handleHistorySelect = (historyQuery: string) => {
    setQuery(historyQuery);
    performSearch(historyQuery);
    
    // 聚焦输入框
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 监听点击事件，点击外部时隐藏历史记录
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          className="pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">搜索</span>
        </Button>
      </form>

      {/* 搜索历史 */}
      {showHistory && (
        <div className="absolute z-20 w-full">
          <SearchHistory onSelectHistory={handleHistorySelect} />
        </div>
      )}
    </div>
  );
} 