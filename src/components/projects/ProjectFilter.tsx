"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectCategory, TechnologyTag } from "@/types/project";
import { LayoutGrid, List, Filter, X, Search } from "lucide-react";
import ViewToggle from './ViewToggle';

interface ProjectFilterProps {
  categories: ProjectCategory[];
  technologies: TechnologyTag[];
  onViewChange?: (view: "grid" | "list") => void;
}

export default function ProjectFilter({
  categories,
  technologies,
  onViewChange
}: ProjectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [selectedTech, setSelectedTech] = useState<string>(
    searchParams.get("tech") || "all"
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // 更新URL查询参数并触发路由更新
  const updateFilters = (category: string, tech: string) => {
    // 保存当前滚动位置
    const scrollPosition = window.scrollY;
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    
    if (tech === "all") {
      params.delete("tech");
    } else {
      params.set("tech", tech);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    
    // 使用 replace 而不是 push 来避免在历史记录中添加新条目
    router.replace(url, { scroll: false });
    
    // 在路由变更后恢复滚动位置
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };
  
  // 处理类别变更
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters(category, selectedTech);
  };
  
  // 处理技术栈变更
  const handleTechChange = (tech: string) => {
    setSelectedTech(tech);
    updateFilters(selectedCategory, tech);
  };
  
  // 处理视图变更
  const handleViewChange = (newView: "grid" | "list") => {
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };
  
  // 重置所有筛选器
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedTech("all");
    updateFilters("all", "all");
  };
  
  // 在URL参数变化时更新组件状态
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const tech = searchParams.get("tech") || "all";
    
    setSelectedCategory(category);
    setSelectedTech(tech);
  }, [searchParams]);
  
  // 加载保存的视图模式
  useEffect(() => {
    try {
      const savedViewMode = localStorage.getItem('projectsViewMode');
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        setView(savedViewMode as 'grid' | 'list');
        // 同步到文档根元素数据属性
        document.documentElement.dataset.projectViewMode = savedViewMode;
      }
    } catch (e) {
      console.error('无法访问localStorage', e);
    }
  }, []);
  
  // 处理视图模式变更
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setView(mode);
    
    // 保存到 localStorage
    try {
      localStorage.setItem('projectsViewMode', mode);
    } catch (e) {
      console.error('无法保存到localStorage', e);
    }
    
    // 添加到文档根元素，以便其他组件可以观察变化
    document.documentElement.dataset.projectViewMode = mode;
  };
  
  return (
    <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md animate-fade-in">
      {/* 筛选器头部 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            发现项目
          </h2>
          <div className="ml-3 h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
          <p className="ml-3 text-gray-600 dark:text-gray-300 text-sm hidden sm:block">发现有趣的项目和创意</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 视图切换 */}
          <ViewToggle viewMode={view} onChange={handleViewModeChange} />
          
          {/* 移动端筛选器切换按钮 */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:hidden flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
          
          {/* 筛选器重置按钮 - 仅在有筛选条件时显示 */}
          {(selectedCategory !== "all" || selectedTech !== "all") && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <X className="w-4 h-4" />
              重置筛选
            </button>
          )}
        </div>
      </div>
      
      {/* 搜索框 */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
          placeholder="搜索项目名称或技术栈..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* 筛选器主体 - 响应式处理 */}
      <div className={`grid sm:grid-cols-[1fr_auto] gap-4 ${filtersOpen ? 'block' : 'hidden sm:grid'}`}>
        <div className="space-y-6">
          {/* 类别筛选 */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
              项目类别
            </h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 pb-2 custom-scrollbar">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
                }`}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.slug
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* 技术栈筛选 */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span>
              技术栈
            </h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 pb-2 custom-scrollbar">
              <button
                onClick={() => handleTechChange("all")}
                className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${
                  selectedTech === "all"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm"
                }`}
              >
                全部
              </button>
              {technologies.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleTechChange(tech.name)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${
                    selectedTech === tech.name
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm"
                  }`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 当前筛选状态指示器 */}
      {(selectedCategory !== "all" || selectedTech !== "all") && (
        <div className="mt-6 flex items-center px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
          <span className="text-sm text-blue-800 dark:text-blue-300">
            当前筛选：
            {selectedCategory !== "all" && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300">
                类别: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => handleCategoryChange("all")} className="ml-1 text-blue-500 hover:text-blue-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedTech !== "all" && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-300">
                技术: {selectedTech}
                <button onClick={() => handleTechChange("all")} className="ml-1 text-indigo-500 hover:text-indigo-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
} 