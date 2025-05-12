"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { siteCategories } from '@/lib/data/good-sites';

interface CategoryFilterProps {
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 处理客户端水合问题
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    onCategoryChange(newCategory);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
    onCategoryChange(null);
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      {/* 移动端下拉菜单 */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium">
              {selectedCategory ? `分类: ${selectedCategory}` : '按分类筛选'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg py-2"
          >
            {selectedCategory && (
              <div 
                className="px-3 py-2 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 mb-2"
              >
                <span className="text-sm font-medium">{selectedCategory}</span>
                <button
                  onClick={clearFilter}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="max-h-60 overflow-y-auto">
              {siteCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    handleCategoryClick(category);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 桌面端分类标签 */}
      <div className="hidden md:block">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">分类筛选:</span>
          {selectedCategory && (
            <button
              onClick={clearFilter}
              className="ml-2 text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
            >
              清除筛选 <X className="ml-1 h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {siteCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryClick(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md font-medium'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
} 