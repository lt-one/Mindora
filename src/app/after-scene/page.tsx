"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {   Card,   CardContent,   CardDescription,   CardFooter,   CardHeader,   CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Film, 
  Calendar, 
  Clock, 
  Star,
  ArrowRight,
  BookOpen,
  Quote,
  Play,
  Camera,
  Heart,
  PenTool,
  MessageCircle,
  ChevronRight,
  Bookmark,
  ThumbsUp,
  Sparkles
} from 'lucide-react';



// 精选书籍评论
const featuredBook = {
  title: '《百年孤独》：魔幻现实中的人性探索',
  slug: 'one-hundred-years-of-solitude',
  coverImage: '/images/blog/PlaceImage.png',
  author: '加西亚·马尔克斯',
  category: '文学',
  tags: ['魔幻现实主义', '家族史诗', '拉美文学'],
  excerpt: '在马孔多这个被遗忘的小镇，布恩迪亚家族上演了一出跨越百年的人性悲喜剧...',
  quote: "多年以后，奥雷里亚诺上校站在行刑队面前，准会想起父亲带他去见识冰块的那个遥远的下午。",
  publishedAt: '2023-12-01',
};

// 精选电影评论
const featuredMovie = {
  title: '《盗梦空间》：潜意识迷宫中的现实探寻',
  slug: 'inception',
  coverImage: '/images/blog/PlaceImage.png',
  director: '克里斯托弗·诺兰',
  category: '科幻',
  tags: ['梦境', '现实与虚幻', '心理悬疑'],
  excerpt: '诺兰构建了一个关于梦境嵌套的精妙世界，在视觉奇观背后探讨了记忆、创伤与现实的本质...',
  quote: "你在等一班永远不会到站的火车吗？",
  keyScene: {
    title: "折叠巴黎场景",
    description: "阿里阿德妮在梦中折叠巴黎街道，展示了梦境建筑师扭曲物理规则的能力。",
  },
  duration: 148,
  publishedAt: '2023-12-05',
};

// 推荐阅读和观影列表
const recommendedItems = [
  { title: '《挪威的森林》', type: 'book', author: '村上春树' },
  { title: '《星际穿越》', type: 'movie', director: '克里斯托弗·诺兰' },
  { title: '《人类简史》', type: 'book', author: '尤瓦尔·赫拉利' },
  { title: '《寄生虫》', type: 'movie', director: '奉俊昊' },
];

export default function AfterScenePage() {
  const router = useRouter();
  
  // 处理按钮点击事件
  const handleButtonClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    router.push(path);
  };
  
  // 处理卡片点击事件
  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-gradient-to-tr from-orange-500/10 to-red-500/5 rounded-full blur-3xl"></div>
      
      {/* 页面网格装饰 */}
      <div className="absolute inset-0 bg-grid-primary/5 bg-[size:20px_20px] pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-8 relative">
        {/* 页面标题和描述 - 整合"关于"部分内容 */}
        <div className="text-center mb-16 relative">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping opacity-20"></div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-blue-400">
            散场之后
          </h1>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-ping opacity-20 animation-delay-700"></div>
              <Film className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <p className="mt-2 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            在这里，记录那些阅读与观影后留存于心的思考，分享对文字与影像的感悟
          </p>
          
          <div className="flex justify-center mt-6 mb-8">
            <div className="bg-muted/50 dark:bg-muted/20 rounded-lg px-4 py-3 max-w-2xl text-sm text-center italic text-muted-foreground">
              <Quote className="inline-block h-3 w-3 mr-1 mb-1" />
              <span>每一次阅读与观影都不仅是消遣，而是一场与作者、导演的思想对话，一次审美与思考的锤炼</span>
              <Quote className="inline-block h-3 w-3 ml-1 mb-1 rotate-180" />
            </div>
          </div>
          
          <Separator className="mx-auto w-1/3 my-6 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
        </div>

        {/* 介绍卡片区域 - 使用错位设计 */}
        <div className="w-full max-w-7xl mx-auto relative mb-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-red-50/50 dark:from-blue-950/30 dark:via-transparent dark:to-red-950/30 rounded-3xl -rotate-1 transform scale-105 blur-sm"></div>
          
          {/* 书页留思卡片 - 向左错位 */}
          <div className="relative z-10 pl-0 md:pl-12 lg:pl-24 mb-24">
            <div className="absolute -left-4 top-1/4 w-32 border-t border-blue-200 dark:border-blue-800"></div>
            <div 
              className="block cursor-pointer transform hover:-translate-y-1 transition-all duration-300 max-w-3xl ml-auto"
              onClick={() => handleCardClick('/after-scene/books')}
            >
              <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group hover:shadow-xl shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-60 transition-opacity duration-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-32 h-32 text-primary/30 transform group-hover:scale-110 transition-transform duration-500"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  </div>
                  <div className="w-full md:w-3/5 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-3xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">书页留思</h2>
                      <Badge className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-sm">
                        阅读感悟
                      </Badge>
                </div>
                  <p className="text-muted-foreground mb-6">
                    这里记录阅读旅程的点滴感悟，探索文字如何塑造思维，分享那些改变我们的书籍。沉浸在字里行间，发现思想的智慧与力量。
                  </p>
                    <div className="flex justify-between items-end">
                  <div className="inline-flex items-center text-primary hover:underline">
                    浏览全部书评
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    进入书页留思
                  </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            </div>

          {/* 光影随想卡片 - 向右错位 */}
          <div className="relative z-10 pr-0 md:pr-12 lg:pr-24">
            <div className="absolute -right-4 top-1/4 w-32 border-t border-red-200 dark:border-red-800"></div>
            <div 
              className="block cursor-pointer transform hover:-translate-y-1 transition-all duration-300 max-w-3xl"
              onClick={() => handleCardClick('/after-scene/movies')}
            >
              <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group hover:shadow-xl shadow-md">
                <div className="flex flex-col-reverse md:flex-row">
                  <div className="w-full md:w-3/5 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">光影随想</h2>
                      <Badge className="font-medium bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 shadow-sm">
                        影视评论
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      这里分享观影后的情感共鸣与批判思考，探讨电影如何通过视听语言讲述故事，传递理念。在光影交错中，体验多元的人生与情感。
                    </p>
                    <div className="flex justify-between items-end">
                      <div className="inline-flex items-center text-primary hover:underline">
                        浏览全部影评
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                      <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                        进入光影随想
                      </Button>
                    </div>
                  </div>
                  <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-900 dark:to-red-950 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-60 transition-opacity duration-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-32 h-32 text-primary/30 transform group-hover:scale-110 transition-transform duration-500"
                    >
                      <path d="M21 2v20M3 16v4M3 12v1M3 7v1M17 2v20M12 2v20M7 2v20" />
                      <path d="M17 16h4M12 12h9M7 7h12M3 3h4" />
                    </svg>
                  </div>
                  </div>
                </div>
              </Card>
            </div>
            </div>
          </div>

        {/* 带波浪分隔器的中间区域 */}
        <div className="relative py-6 my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-6 py-2 bg-gradient-to-r from-blue-50 via-background to-red-50 dark:from-blue-950/30 dark:via-background dark:to-red-950/30 rounded-full border shadow-sm">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">精选内容</span>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* 引言区域 - 集成部分"关于"内容 */}
        <div className="mb-12 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-red-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-red-950/20 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-4 mb-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">对话与思考</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-0 leading-relaxed">
            「散场之后」是记录文化消费体验与思考的个人空间，通过结构化的内容组织，为访客提供有价值的文化内容推荐和思考启发。在信息碎片化的当下，希望提供一方沉淀思想的净土。
          </p>
        </div>

        {/* 精选内容预览区域 - 左右布局 */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* 精选书评 - 左侧 */}
            <div className="lg:col-span-6 group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">书页留思: 最新精选</span>
                </h3>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {featuredBook.publishedAt}
                </Badge>
              </div>
              
                <div 
                className="block cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100/50 dark:border-blue-900/30 relative group"
                  onClick={() => handleCardClick(`/after-scene/books/${featuredBook.slug}`)}
                >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 opacity-30"></div>
                      <Image
                        src={featuredBook.coverImage}
                        alt={featuredBook.title}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                      <Badge className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-sm px-3 py-1">
                          {featuredBook.category}
                        </Badge>
                      </div>
                          </div>
                  
                  <div className="p-5 md:w-3/5">
                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{featuredBook.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-3">{featuredBook.author}</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    
                    <blockquote className="border-l-3 border-blue-500/30 pl-3 italic text-muted-foreground my-3 text-sm line-clamp-2">
                        "{featuredBook.quote}"
                      </blockquote>
                    
                    <div className="flex justify-end items-center mt-4">
                          <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={(e) => handleButtonClick(e, `/after-scene/books/${featuredBook.slug}`)}
                          >
                            阅读完整书评
                        <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                </div>
                </div>
              </div>

            {/* 精选影评 - 右侧 */}
            <div className="lg:col-span-6 group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium flex items-center">
                  <Film className="mr-2 h-5 w-5 text-red-500" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">光影随想: 最新精选</span>
                </h3>
                <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                  {featuredMovie.duration}分钟
                </Badge>
              </div>
              
                <div 
                className="block cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-red-100/50 dark:border-red-900/30 relative group"
                  onClick={() => handleCardClick(`/after-scene/movies/${featuredMovie.slug}`)}
                >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/30 opacity-30"></div>
                      <Image
                        src={featuredMovie.coverImage}
                        alt={featuredMovie.title}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                      <Badge className="font-medium bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 shadow-sm px-3 py-1">
                          {featuredMovie.category}
                        </Badge>
                      </div>
                          </div>
                  
                  <div className="p-5 md:w-3/5">
                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{featuredMovie.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="mr-3">{featuredMovie.director}</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500 opacity-50" />
                    </div>
                    
                    <blockquote className="border-l-3 border-red-500/30 pl-3 italic text-muted-foreground my-3 text-sm line-clamp-2">
                        "{featuredMovie.quote}"
                      </blockquote>
                    
                    <div className="flex justify-end items-center mt-4">
                          <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs gap-1 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={(e) => handleButtonClick(e, `/after-scene/movies/${featuredMovie.slug}`)}
                          >
                            阅读完整影评
                        <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                </div>
                </div>
              </div>
            </div>
          </div>

        {/* 推荐阅读和观影列表 */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/20 shadow-sm">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              热门阅读推荐
            </h3>
            <ul className="space-y-2">
              {recommendedItems.filter(item => item.type === 'book').map((item, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs font-medium text-blue-800 dark:text-blue-200 mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.author}</p>
                    </div>
                  </div>
                  <ThumbsUp className="h-4 w-4 text-blue-500" />
                </li>
              ))}
            </ul>
            </div>
        
          <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-5 border border-red-100 dark:border-red-900/20 shadow-sm">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Film className="mr-2 h-5 w-5 text-red-500" />
              热门观影推荐
            </h3>
            <ul className="space-y-2">
              {recommendedItems.filter(item => item.type === 'movie').map((item, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-xs font-medium text-red-800 dark:text-red-200 mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.director}</p>
                    </div>
                  </div>
                  <ThumbsUp className="h-4 w-4 text-red-500" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 