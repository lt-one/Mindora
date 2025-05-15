"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MotionDiv } from '@/components/motion';
import { ExternalLink, Bookmark, Star } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface SiteCardProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  useCases: string[];
  recommendReason: string;
  tags: string[];
  screenshot?: string;
  category: string;
}

// 站点图标占位符组件
function SiteIconPlaceholder({ name }: { name: string }) {
  // 根据网站名称生成一个颜色
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const bgColor = stringToColor(name);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div 
      className="w-full h-full flex items-center justify-center text-white text-lg font-bold rounded-sm" 
      style={{ backgroundColor: bgColor }}
    >
      {initial}
    </div>
  );
}

// 网站截图占位符组件
function ScreenshotPlaceholder({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
          <span className="text-gray-500 dark:text-gray-400 text-xl">{name.charAt(0)}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{name}</p>
      </div>
    </div>
  );
}

export default function SiteCard({ name, url, logo, description, tags, screenshot, category, recommendReason, useCases }: SiteCardProps) {
  const router = useRouter();
  
  // 点击分类标签时的处理
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 根据分类更新URL，实现筛选效果
    router.push(`/good-sites?category=${category}`);
  };
  
  // 点击卡片时的处理
  const handleCardClick = () => {
    // 打开网站链接
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      {/* 移除外层Link，改用div加onClick */}
      <div className="block h-full cursor-pointer" onClick={handleCardClick}>
        <Card className="overflow-hidden h-full flex flex-col bg-background/90 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 relative cursor-pointer">
          {/* 卡片装饰背景 */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-blue-50/30 to-purple-50/20 dark:from-transparent dark:via-blue-900/10 dark:to-purple-900/10 opacity-60"></div>
          
          {/* 图片区域 */}
          <div className="overflow-hidden relative group">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              {screenshot ? (
                <Image 
                  src={screenshot} 
                  alt={`${name} screenshot`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <ScreenshotPlaceholder name={name} />
              )}
            </AspectRatio>
            
            {/* 分类标签 - 改为可点击版本，并覆盖悬停样式 */}
            <div className="absolute top-3 left-3 z-10" onClick={handleCategoryClick}>
              <Badge 
                variant="secondary" 
                className="bg-background/80 backdrop-blur-sm border-border text-xs cursor-pointer hover:bg-background/80"
              >
                {category}
              </Badge>
            </div>
          </div>
          
          {/* 内容区域 */}
          <CardHeader className="p-4 pb-0 flex-row items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden border">
              {logo ? (
                <Image 
                  src={logo} 
                  alt={`${name} logo`} 
                  width={32} 
                  height={32} 
                  className="object-cover"
                />
              ) : (
                <SiteIconPlaceholder name={name} />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold text-base truncate">{name}</h3>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-2 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            {/* 使用Button代替Link嵌套Button的结构 */}
            <Button 
              className="w-full h-8 text-xs" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation(); // 防止触发父元素的点击事件
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
            >
              访问网站
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MotionDiv>
  );
}