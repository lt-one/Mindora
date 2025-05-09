"use client";

import { useState, useEffect } from "react";
import { 
  BarChart2, 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  Hash, 
  Users, 
  Bookmark 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BlogStatsProps {
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  popularTags?: { name: string; count: number }[];
}

export default function BlogStats({
  totalPosts,
  totalCategories,
  totalTags,
  popularTags = [],
}: BlogStatsProps) {
  const [currentDate, setCurrentDate] = useState("");

  // 使用useEffect在客户端设置日期
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* 文章统计卡片 */}
      <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 pb-2">
          <CardTitle className="flex items-center text-lg text-blue-700 dark:text-blue-300">
            <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            博客统计
          </CardTitle>
          <CardDescription>
            文章内容和更新频率
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                文章总数
              </div>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                {totalPosts} 篇
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Bookmark className="w-4 h-4 mr-2 text-indigo-500" />
                文章分类
              </div>
              <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                {totalCategories} 个
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Hash className="w-4 h-4 mr-2 text-purple-500" />
                文章标签
              </div>
              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                {totalTags} 个
              </Badge>
            </div>
          </div>
        </CardContent>
        <Separator className="mb-3" />
        <CardFooter className="pt-0">
          <div className="w-full flex flex-wrap gap-1">
            {popularTags.slice(0, 5).map((tag) => (
              <Badge 
                key={tag.name} 
                variant="secondary"
                className="bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                #{tag.name}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
      
      {/* 阅读统计卡片 */}
      <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 pb-2">
          <CardTitle className="flex items-center text-lg text-green-700 dark:text-green-300">
            <BarChart2 className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            阅读统计
          </CardTitle>
          <CardDescription>
            文章阅读情况分析
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2 text-green-500" />
                总访问量
              </div>
              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                {(totalPosts * 125).toLocaleString()} 次
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                平均阅读时间
              </div>
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                8 分钟
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                最后更新
              </div>
              <Badge variant="outline" className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
                3 天前
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-3 text-xs text-gray-500 dark:text-gray-400">
          {currentDate ? `数据更新于 ${currentDate}` : "数据加载中..."}
        </CardFooter>
      </Card>

      {/* 博客动态卡片 */}
      <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-amber-100 dark:border-amber-900 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 pb-2">
          <CardTitle className="flex items-center text-lg text-amber-700 dark:text-amber-300">
            <Calendar className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
            最新动态
          </CardTitle>
          <CardDescription>
            博客更新与近期活动
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full p-1 mt-0.5">
                <BookOpen className="w-3 h-3" />
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-200">新文章《Next.js 14深度解析》已发布</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2天前</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full p-1 mt-0.5">
                <Bookmark className="w-3 h-3" />
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-200">新增"前端性能优化"分类</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">4天前</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full p-1 mt-0.5">
                <Hash className="w-3 h-3" />
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-200">新增标签: TypeScript, React</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1周前</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 cursor-pointer">
            查看全部动态
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
} 