"use client";

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Film, 
  Clock, 
  Star, 
  Calendar,
  Search,
  LayoutGrid,
  ListStart,
  User,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

// 注意：metadata在客户端组件中无法使用，需要将其移动到单独的文件中
// 或者使用布局文件中的metadata
/*
export const metadata: Metadata = {
  title: '光影随想 | 散场之后',
  description: '电影观影笔记与影评，记录银幕故事的思考与感悟',
};
*/

// 模拟数据 - 正式开发时应该从API获取
const movieReviews = [
  {
    id: '1',
    title: '《盗梦空间》：潜意识迷宫中的现实探寻',
    slug: 'inception',
    coverImage: '/PlaceImage.png',
    director: '克里斯托弗·诺兰',
    actors: ['莱昂纳多·迪卡普里奥', '约瑟夫·高登-莱维特', '艾伦·佩吉'],
    category: '科幻',
    tags: ['梦境', '现实与虚幻', '心理悬疑'],
    publishedAt: '2023-12-05',
    watchDate: '2023-11-20',
    duration: 148,
    excerpt: '诺兰构建了一个关于梦境嵌套的精妙世界，在视觉奇观背后探讨了记忆、创伤与现实的本质...',
  },
  {
    id: '2',
    title: '《肖申克的救赎》：希望是最美好的东西',
    slug: 'the-shawshank-redemption',
    coverImage: '/PlaceImage.png',
    director: '弗兰克·德拉邦特',
    actors: ['蒂姆·罗宾斯', '摩根·弗里曼'],
    category: '剧情',
    tags: ['监狱', '友情', '希望', '救赎'],
    publishedAt: '2023-11-25',
    watchDate: '2023-11-10',
    duration: 142,
    excerpt: '安迪·杜佛雷恩在肖申克监狱的二十年，是一段关于希望、友谊与救赎的动人旅程...',
  },
  {
    id: '3',
    title: '《星际穿越》：跨越时空的爱与科学',
    slug: 'interstellar',
    coverImage: '/PlaceImage.png',
    director: '克里斯托弗·诺兰',
    actors: ['马修·麦康纳', '安妮·海瑟薇', '杰西卡·查斯坦'],
    category: '科幻',
    tags: ['太空探索', '相对论', '父女情感'],
    publishedAt: '2023-10-15',
    watchDate: '2023-10-01',
    duration: 169,
    excerpt: '当地球即将不再适合人类居住，一位农夫必须踏上星际旅程寻找人类的新家园...',
  },
];

export default function MoviesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState('grid');
  
  // 根据选择的分类筛选电影
  const filteredMovies = selectedCategory === 'all' 
    ? movieReviews 
    : movieReviews.filter(movie => {
        if (selectedCategory === 'scifi') return movie.category === '科幻';
        if (selectedCategory === 'drama') return movie.category === '剧情';
        if (selectedCategory === 'action') return movie.category === '动作';
        return true;
      });

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-12">
        <div className="flex flex-col gap-8">
          {/* 页面顶部区域 - 重新设计 */}
          <div className="relative">
            {/* 返回按钮 - 独立定位，更加醒目 */}
            <div className="mb-3">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Link href="/after-scene" className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <span>返回散场之后</span>
                </Link>
              </Button>
            </div>
            
            {/* 标题区域 - 更加醒目的标题设计 */}
            <div className="border-b pb-6 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-400 mb-3">
                光影随想
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                记录观影体验，分享电影带来的思考与感悟
              </p>
            </div>
          </div>
          
          {/* 过滤器和视图切换 - 更加紧凑直观的设计 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-muted/40 p-4 rounded-lg">
            <div className="inline-flex items-center">
              <span className="mr-2 text-sm font-medium">分类:</span>
              <Tabs 
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="w-[400px]"
              >
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="scifi">科幻</TabsTrigger>
                  <TabsTrigger value="drama">剧情</TabsTrigger>
                  <TabsTrigger value="action">动作</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">视图:</span>
              <Tabs 
                value={view} 
                onValueChange={setView}
                className="w-[120px]"
              >
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="grid">
                    <LayoutGrid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <ListStart className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* 网格视图 */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((review) => (
                <Link key={review.id} href={`/after-scene/movies/${review.slug}`} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 border hover:border-primary/30">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <Image
                        src={review.coverImage}
                        alt={review.title}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <Badge className="bg-primary/80 hover:bg-primary/70">{review.category}</Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {review.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-4 w-4" />
                        <span>{review.director}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{review.duration} 分钟</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{review.excerpt}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{review.publishedAt}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-full">
                        阅读更多
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          {/* 列表视图 */}
          {view === 'list' && (
            <div className="space-y-4">
              {filteredMovies.map((review) => (
                <Link key={review.id} href={`/after-scene/movies/${review.slug}`} className="group">
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border hover:border-primary/30">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48 overflow-hidden bg-muted">
                        <Image
                          src={review.coverImage}
                          alt={review.title}
                          fill
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <Badge className="bg-primary/80 hover:bg-primary/70">{review.category}</Badge>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <CardTitle className="mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {review.title}
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <User className="mr-1 h-4 w-4" />
                          <span>{review.director}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{review.duration} 分钟</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex-1 mb-2">{review.excerpt}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{review.publishedAt}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="rounded-full">
                            阅读更多
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 