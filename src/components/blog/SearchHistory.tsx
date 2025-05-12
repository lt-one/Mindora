"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Clock,
  X,
  Search,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 最大历史记录数
const MAX_HISTORY_ITEMS = 6;

interface SearchHistoryProps {
  onSelectHistory: (query: string) => void;
}

export default function SearchHistory({ onSelectHistory }: SearchHistoryProps) {
  // 搜索历史记录
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();

  // 从localStorage加载搜索历史
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('blog_search_history');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('无法加载搜索历史:', error);
    }
  }, []);

  // 保存历史记录到localStorage
  const saveHistory = (history: string[]) => {
    try {
      localStorage.setItem('blog_search_history', JSON.stringify(history));
    } catch (error) {
      console.error('无法保存搜索历史:', error);
    }
  };

  // 添加搜索词到历史记录
  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    
    // 移除重复项并将新项添加到前面
    const newHistory = [
      query, 
      ...searchHistory.filter(item => item !== query)
    ].slice(0, MAX_HISTORY_ITEMS);
    
    setSearchHistory(newHistory);
    saveHistory(newHistory);
  };

  // 移除单个历史记录
  const removeHistoryItem = (query: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止点击事件传播
    const newHistory = searchHistory.filter(item => item !== query);
    setSearchHistory(newHistory);
    saveHistory(newHistory);
  };

  // 清空所有历史记录
  const clearAllHistory = () => {
    setSearchHistory([]);
    saveHistory([]);
  };

  // 点击历史记录项
  const handleHistoryClick = (query: string) => {
    onSelectHistory(query);
    // 使历史记录项上移
    addToHistory(query);
  };

  // 如果没有历史记录，不显示组件
  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <Card className="mt-1 border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in-50 slide-in-from-top-5 duration-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span>搜索历史</span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-gray-500 hover:text-red-500"
                  onClick={clearAllHistory}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>清除所有历史</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-wrap gap-2">
          {searchHistory.map((query, index) => (
            <Badge 
              key={index}
              variant="outline"
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer group"
              onClick={() => handleHistoryClick(query)}
            >
              <Search className="w-3 h-3 text-gray-400" />
              <span className="truncate max-w-[150px]">{query}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 opacity-50 group-hover:opacity-100"
                onClick={(e) => removeHistoryItem(query, e)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">删除</span>
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 插入搜索词到历史记录的辅助函数 - 可在其他组件中使用
export function addSearchToHistory(query: string) {
  if (!query.trim()) return;
  
  try {
    const savedHistory = localStorage.getItem('blog_search_history');
    let history: string[] = savedHistory ? JSON.parse(savedHistory) : [];
    
    // 移除重复项并将新项添加到前面
    history = [
      query, 
      ...history.filter(item => item !== query)
    ].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem('blog_search_history', JSON.stringify(history));
  } catch (error) {
    console.error('无法保存搜索历史:', error);
  }
} 