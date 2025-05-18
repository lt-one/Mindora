"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Book, Filter, Hash, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogCategory, BlogTag } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import SearchBox from "./SearchBox";

interface BlogFilterProps {
  categories: BlogCategory[];
  tags: BlogTag[];
}

export default function BlogFilter({
  categories,
  tags,
}: BlogFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 检查当前是否在分类页面
  const isCategoryPage = pathname?.includes("/blog/category/");
  // 检查当前是否在所有分类页面
  const isAllCategoryPage = pathname === "/blog/all";
  
  /**
   * 从路径中提取分类slug
   */
  const getCategorySlugFromPath = () => {
    if (!pathname) return "";
    if (!isCategoryPage) return "";
    
    const pathParts = pathname.split("/");
    return pathParts[pathParts.length - 1];
  };
  
  /**
   * 更新筛选参数
   */
  const updateFilters = (newCategory: string, newTag: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // 更新分类参数
    if (newCategory !== "all") {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    // 更新标签参数
    if (newTag !== "all") {
      params.set("tag", newTag);
    } else {
      params.delete("tag");
    }

    // 保留搜索查询参数 (如果存在)
    const currentQuery = searchParams.get("q");
    if (currentQuery) {
      params.set("q", currentQuery);
    } else {
      params.delete("q"); // 确保如果没有就不设置
    }

    let targetPath = pathname || "/blog"; // 默认或当前路径

    // 判定目标路径的逻辑
    // 1. 如果是从某个分类页面 (e.g., /blog/category/A) 点击了 "全部" 分类按钮
    if (isCategoryPage && newCategory === "all") {
      targetPath = "/blog/all";
    }
    // 2. 如果最终实际上没有分类被选中 (无论是初始就是 all，还是被清除了)
    //    并且标签也被设为 "all" (即也没有标签筛选)
    //    并且当前不是一个特定的分类页面 (避免与逻辑1冲突)
    else if (!params.has("category") && newTag === "all" && !isCategoryPage) {
      targetPath = "/blog/all";
    }
    // 3. 如果选择了某个特定的分类 (newCategory !== "all")
    else if (newCategory !== "all") {
      // 无论当前在什么页面，如果选了特定分类，目标就是该分类的页面
      targetPath = `/blog/category/${newCategory}`;
    }
    // 4. 如果分类是 "all" (可能是从特定分类页清除，或本来就在 /blog 或 /blog/all)
    //    但仍然有标签被选中 (newTag !== "all")
    else if (newCategory === "all" && newTag !== "all") {
      // 此时应该停留在基础的博客列表页，让标签参数生效
      // 如果之前在 /blog/category/A, isCategoryPage会是true, 但newCategory是all,会走逻辑1或这里
      // 如果之前是 /blog/all 或 /blog, pathname已经是期望值
      if (isCategoryPage) { // 如果是从分类页清除了分类但选了标签
          targetPath = "/blog/all"; // 或者 /blog，取决于 /blog/all?tag=X 和 /blog?tag=X 哪个是标准
      }
      // 如果本来就在 /blog 或 /blog/all, targetPath 已经是它们之一
    }
    // 5. 如果所有筛选都移除了 (newCategory === 'all' && newTag === 'all')，确保去 /blog/all
    if (newCategory === 'all' && newTag === 'all' && !isCategoryPage) { // isCategoryPage 的情况已由1覆盖
        targetPath = '/blog/all';
    }


    const queryString = params.toString();
    let url = queryString ? `${targetPath}?${queryString}` : targetPath;

    // 清理末尾可能出现的 '?'
    if (url.endsWith('?')) {
      url = url.slice(0, -1);
    }
    
    // 确保 /blog/all 和 /blog 不会因为空参数而错误导航
    if ((targetPath === "/blog/all" || targetPath === "/blog") && !queryString) {
        url = targetPath;
    }

    router.push(url, { scroll: false });
  };
  
  /**
   * 处理分类变更
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters(category, selectedTag);
    setFiltersOpen(false);
  };
  
  /**
   * 处理标签变更
   */
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    updateFilters(selectedCategory, tag);
    setFiltersOpen(false);
  };
  
  /**
   * 处理搜索表单提交
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // 更新URL参数
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(url, { scroll: false });
  };
  
  /**
   * 重置所有筛选
   */
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedTag("all");
    setSearchQuery("");
    
    // 清除URL参数
    let url = pathname;
    
    // 如果在分类页面上，跳转到博客首页
    if (isCategoryPage) {
      url = "/blog";
    }
    
    router.push(url, { scroll: false });
  };
  
  // 从URL参数初始化筛选条件
  useEffect(() => {
    // 如果在分类页面
    if (isCategoryPage) {
      const categorySlug = getCategorySlugFromPath();
      setSelectedCategory(categorySlug);
    } else {
      // 否则从查询参数获取
      const queryCategory = searchParams.get("category") || "all";
      setSelectedCategory(queryCategory);
    }
    
    const tag = searchParams.get("tag") || "all";
    const query = searchParams.get("q") || "";
    
    setSelectedTag(tag);
    setSearchQuery(query);
  }, [searchParams, pathname, isCategoryPage, isAllCategoryPage]);
  
  return (
    <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
      {/* 筛选器头部 - 只包含筛选工具按钮 */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-2">
          {/* 移动端筛选器切换按钮 */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:hidden flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
          
          {/* 筛选器重置按钮 - 仅在有筛选条件时显示 */}
          {(selectedCategory !== "all" || selectedTag !== "all") && (
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
      
      {/* 搜索框 - 使用新的SearchBox组件 */}
      <div className="mb-6">
        <SearchBox 
          placeholder="搜索文章标题、内容或标签..."
          paramName="q"
          className="w-full"
        />
      </div>
      
      {/* 筛选器主体 - 响应式处理 */}
      <div className={`grid sm:grid-cols-[1fr_auto] gap-6 ${filtersOpen ? 'block' : 'hidden sm:grid'}`}>
        <div className="space-y-8">
          {/* 分类筛选 */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Book className="w-4 h-4 mr-2 text-blue-500" />
              文章分类
            </h3>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto overflow-x-hidden pr-2 pb-2 custom-scrollbar">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center flex-shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 shadow-sm hover:shadow"
                }`}
              >
                <Book className={`w-3.5 h-3.5 mr-1.5 ${selectedCategory === "all" ? "text-white" : "text-blue-500 dark:text-blue-400"}`} />
                <span>全部</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-3 py-2 text-sm rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center flex-shrink-0 max-w-[150px] ${
                    selectedCategory === category.slug
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 shadow-sm hover:shadow"
                  }`}
                >
                  <Book className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${selectedCategory === category.slug ? "text-white" : "text-blue-500 dark:text-blue-400"}`} />
                  <span className="truncate">{category.name}</span>
                  {category.count && category.count > 0 && (
                    <span className={`ml-1.5 px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                      selectedCategory === category.slug
                        ? "bg-white/30 text-white"
                        : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                    }`}>
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* 标签筛选 - 使用shadcn/ui Badge组件 */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Hash className="w-4 h-4 mr-2 text-indigo-500" />
              文章标签
            </h3>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto overflow-x-hidden pr-2 pb-2 custom-scrollbar">
              {/* "全部"标签 */}
              <button
                onClick={() => handleTagChange("all")}
                className="focus:outline-none"
              >
                <Badge 
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5",
                  selectedTag === "all"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-sm"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  )}
              >
                  <Hash className={`w-3.5 h-3.5 ${selectedTag === "all" ? "text-white" : "text-indigo-500 dark:text-indigo-400"}`} />
                <span>全部</span>
                </Badge>
              </button>
              
              {/* 其他标签 */}
              {tags.map((tag) => {
                const isDisabled = !tag.count || tag.count === 0;
                
                return (
                <button
                  key={tag.id}
                    onClick={isDisabled ? undefined : () => handleTagChange(tag.slug)}
                    className={cn(
                      "focus:outline-none transition-opacity",
                      isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90"
                    )}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                  >
                    <Badge 
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5",
                    selectedTag === tag.slug
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-sm"
                          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600",
                        isDisabled && "bg-gray-100 dark:bg-gray-700 pointer-events-none"
                      )}
                >
                      <Hash className={`w-3.5 h-3.5 ${
                        selectedTag === tag.slug 
                          ? "text-white" 
                          : isDisabled 
                            ? "text-gray-400 dark:text-gray-500" 
                            : "text-indigo-500 dark:text-indigo-400"
                      }`} />
                      <span>{tag.name}</span>
                      {tag.count && tag.count > 0 && (
                        <span className={cn(
                          "ml-1 px-1.5 py-0.5 text-xs rounded-full",
                      selectedTag === tag.slug
                            ? "bg-white/20 text-white"
                            : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
                        )}>
                      {tag.count}
                    </span>
                  )}
                    </Badge>
                </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 