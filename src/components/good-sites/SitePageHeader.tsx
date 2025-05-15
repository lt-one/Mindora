"use client";
import React from 'react';
import { MotionDiv } from '@/components/motion';
import { Compass, Bookmark, Globe, Search, Star, Heart } from 'lucide-react';

export default function SitePageHeader() {
  return (
    <MotionDiv 
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 顶部装饰条 */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <div className="grid md:grid-cols-5 gap-4">
        {/* 左侧标题和描述区域 */}
        <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              好站分享
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            精心收集和分享各类<span className="font-semibold text-blue-600 dark:text-blue-400">优质网站</span>、<span className="font-semibold text-indigo-600 dark:text-indigo-400">实用工具</span>与<span className="font-semibold text-purple-600 dark:text-purple-400">设计资源</span>，为你的工作和学习提供便捷导航与灵感来源。
          </p>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Search className="w-4 h-4 mr-1 text-blue-500" />
              <span>精选资源</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Globe className="w-4 h-4 mr-1 text-indigo-500" />
              <span>分类浏览</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Bookmark className="w-4 h-4 mr-1 text-purple-500" />
              <span>个人推荐</span>
            </div>
          </div>
        </div>
        
        {/* 右侧设计理念 */}
        <div className="md:col-span-2 bg-blue-50/70 dark:bg-blue-900/20 p-6 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-blue-500" />
            设计理念
          </h3>
          
          <div className="space-y-4">
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-200 dark:bg-blue-900/50 rounded-full overflow-hidden">
                <div className="w-full h-1/3 bg-blue-500"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-blue-600 dark:text-blue-400">实用优先</span>：精选对日常工作和学习确有助益的优质网站
              </p>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-indigo-200 dark:bg-indigo-900/50 rounded-full overflow-hidden">
                <div className="w-full h-1/2 bg-indigo-500"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-indigo-600 dark:text-indigo-400">清晰导航</span>：通过分类和标签，帮助快速找到需要的资源
              </p>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 w-1 h-full bg-purple-200 dark:bg-purple-900/50 rounded-full overflow-hidden">
                <div className="w-full h-2/3 bg-purple-500"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-purple-600 dark:text-purple-400">个人体验</span>：基于真实使用体验，分享每个网站的特色和使用技巧
              </p>
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
} 