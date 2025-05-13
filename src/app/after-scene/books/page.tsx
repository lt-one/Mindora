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
  Book, 
  Clock, 
  Star, 
  Calendar,
  Search,
  LayoutGrid,
  ListStart,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

// 注意：metadata在客户端组件中无法使用，需要将其移动到单独的文件中
// 或者使用布局文件中的metadata
/*
export const metadata: Metadata = {
  title: '书页留思 | 散场之后',
  description: '阅读旅程与书籍心得，记录文字如何改变思维的过程',
};
*/

// 模拟数据 - 正式开发时应该从API获取
const bookReviews = [
  {
    id: '1',
    title: '《百年孤独》：魔幻现实中的人性探索',
    slug: 'one-hundred-years-of-solitude',
    coverImage: '/images/blog/PlaceImage.png',
    author: '加西亚·马尔克斯',
    category: '文学',
    tags: ['魔幻现实主义', '家族史诗', '拉美文学'],
    publishedAt: '2023-12-01',
    readingStartDate: '2023-11-01',
    readingEndDate: '2023-11-25',
    excerpt: '在马孔多这个被遗忘的小镇，布恩迪亚家族上演了一出跨越百年的人性悲喜剧...',
  },
  {
    id: '2',
    title: '《设计模式》：代码世界的建筑智慧',
    slug: 'design-patterns',
    coverImage: '/images/blog/PlaceImage.png',
    author: 'Erich Gamma等',
    category: '技术',
    tags: ['编程', '设计模式', '软件架构'],
    publishedAt: '2023-11-15',
    readingStartDate: '2023-10-10',
    readingEndDate: '2023-11-05',
    excerpt: '本书详细介绍了23种经典设计模式，探讨了面向对象设计原则如何指导实际编程...',
  },
  {
    id: '3',
    title: '《三体》：宇宙黑暗森林中的生存博弈',
    slug: 'three-body-problem',
    coverImage: '/images/blog/PlaceImage.png',
    author: '刘慈欣',
    category: '科幻',
    tags: ['硬科幻', '宇宙社会学', '技术奇点'],
    publishedAt: '2023-10-20',
    readingStartDate: '2023-09-15',
    readingEndDate: '2023-10-15',
    excerpt: '当人类文明遭遇三体文明，宇宙社会学的黑暗森林法则逐渐揭示...',
  },
];

export default function BooksPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState('grid');
  
  // 根据选择的分类筛选书籍
  const filteredBooks = selectedCategory === 'all' 
    ? bookReviews 
    : bookReviews.filter(book => {
        if (selectedCategory === 'fiction') return book.category === '文学';
        if (selectedCategory === 'tech') return book.category === '技术';
        if (selectedCategory === 'scifi') return book.category === '科幻';
        return true;
      });

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-12">
        <div className="flex flex-col gap-8">
          {/* 页面顶部区域 - 重新设计 */}
          <div className="relative">
            {/* 返回按钮 - 独立定位，更加醒目 */}
            <div className="mb-6">
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 mb-3">
                书页留思
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                阅读，思考，记录 — 探索文字世界的奇妙旅程
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
                  <TabsTrigger value="fiction">文学</TabsTrigger>
                  <TabsTrigger value="tech">技术</TabsTrigger>
                  <TabsTrigger value="scifi">科幻</TabsTrigger>
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
              {filteredBooks.map((review) => (
                <Link key={review.id} href={`/after-scene/books/${review.slug}`} className="group">
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
                        <Book className="mr-1 h-4 w-4" />
                        <span>{review.author}</span>
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
              {filteredBooks.map((review) => (
                <Link key={review.id} href={`/after-scene/books/${review.slug}`} className="group">
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
                          <Book className="mr-1 h-4 w-4" />
                          <span>{review.author}</span>
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