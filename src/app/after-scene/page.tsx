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
  Sparkles,
  User,
  FileText
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
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 mt-4 relative">
        {/* 页面标题和描述 - 整合"关于"部分内容 */}
        <div className="text-center mb-10 relative">
          <div className="flex items-center justify-center space-x-4 mb-3">
                          <div className="relative mt-6 w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping opacity-20"></div>
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
          <h1 className="text-3xl md:text-5xl mt-6 font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-blue-400">
            散场之后
          </h1>
            <div className="relative mt-6 w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-ping opacity-20 animation-delay-700"></div>
              <Film className="w-6 h-6 text-red-500" />
            </div>
          </div>
          
          <p className="mt-1 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            在这里，记录那些阅读与观影后留存于心的思考，分享对文字与影像的感悟
          </p>
          
          <div className="flex justify-center mt-3 mb-4">
            <div className="bg-muted/50 dark:bg-muted/20 rounded-lg px-3 py-2 max-w-2xl text-xs text-center italic text-muted-foreground">
              <Quote className="inline-block h-3 w-3 mr-1 mb-1" />
              <span>每一次阅读与观影都不仅是消遣，而是一场与作者、导演的思想对话，一次审美与思考的锤炼</span>
              <Quote className="inline-block h-3 w-3 ml-1 mb-1 rotate-180" />
            </div>
          </div>
          
          <Separator className="mx-auto w-1/3 my-3 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
        </div>

        {/* 主要内容卡片区域 */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col space-y-20 mb-20">
            {/* 书页留思 - 3D书籍设计 */}
            <div className="relative">
              <div className="flex items-center">
                {/* 左侧3D书籍展示区域 */}
                <div className="w-5/12 pr-6 relative" onClick={() => handleCardClick('/after-scene/books')}>
                  <div className="relative perspective-1000 transform-gpu transition-all duration-500 hover:scale-105 cursor-pointer h-80">
                    {/* 书本阴影效果 */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-4 bg-black/20 dark:bg-black/40 blur-md rounded-full"></div>
                    
                    {/* 书脊阴影和装饰 */}
                    <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-blue-900/40 to-transparent transform skew-y-12 -translate-x-3 rounded-l-md"></div>
                    
                    {/* 书的封面 */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-r-md rounded-b-md border-t border-r border-b border-blue-300 dark:border-blue-900 shadow-xl transform rotate-y-5 rotateX-5 group-hover:rotate-y-30"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: 'rotateY(25deg) rotateX(5deg)'
                      }}
                    >
                      {/* 封面纹理效果 */}
                      <div className="absolute inset-0 bg-[url('/svg-images/paper-texture.svg')] opacity-10"></div>
                      
                      <div className="absolute inset-0 overflow-hidden rounded-r-md rounded-b-md">
                        {/* 封面背景图 */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${featuredBook.coverImage})` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/60 to-blue-700/30"></div>
                        
                        {/* 书本封面设计 */}
                        <div className="absolute top-0 left-0 right-0 p-5 flex flex-col items-center">
                          <div className="w-16 h-1 bg-gold-300 dark:bg-gold-500 rounded mb-3"></div>
                        </div>
                        
                        <div className="absolute top-1/3 left-0 right-0 flex flex-col items-center">
                          <h3 className="text-2xl font-serif font-bold mb-2 text-white text-center px-4 tracking-wide">书页留思</h3>
                          <div className="w-12 h-0.5 bg-white/60 rounded mb-2"></div>
                          <p className="text-sm opacity-90 text-white/90 text-center px-4">阅读，思考，感悟</p>
                        </div>
                      </div>
                      
                      {/* 书脊 */}
                      <div 
                        className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-blue-800 to-blue-600 rounded-l-sm transform-gpu origin-left"
                        style={{ 
                          transform: 'rotateY(-25deg) translateX(-95%)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        <div className="h-full flex items-center justify-center relative">
                          {/* 书脊装饰 */}
                          <div className="absolute top-6 left-0 right-0 flex justify-center">
                            <div className="w-6 h-0.5 bg-gold-300 dark:bg-gold-500"></div>
                          </div>
                          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                            <div className="w-6 h-0.5 bg-gold-300 dark:bg-gold-500"></div>
                          </div>
                          
                          {/* 移除书脊文字 */}
                        </div>
                      </div>
                      
                      {/* 书页效果 - 增强多层次感 */}
                      <div className="absolute top-0.5 bottom-0.5 -right-1 w-1 bg-blue-50/30 dark:bg-white/20 rounded"></div>
                      <div className="absolute top-1 bottom-1 -right-2 w-0.5 bg-blue-50/20 dark:bg-white/10 rounded"></div>
                      <div className="absolute top-1.5 bottom-1.5 -right-3 w-0.5 bg-blue-50/10 dark:bg-white/5 rounded"></div>
                      
                      {/* 移除书页翻折效果 */}
                  </div>
                  </div>
                </div>
                
                {/* 右侧内容区域 */}
                <div className="w-7/12 pl-8 py-4 bg-gradient-to-r from-blue-50/70 to-transparent dark:from-blue-950/20 dark:to-transparent rounded-r-xl">
                  <div className="mb-1 flex items-center">
                    <h2 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mr-3">书页留思</h2>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">阅读感悟</Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <BookOpen className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="font-medium">阅读体验:</span>
                    <span className="ml-1 text-xs">探索世界，拓展视野，滋养心灵</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    这里记录阅读旅程的点滴感悟，探索文字如何塑造思维，分享那些改变我们的书籍。沉浸在字里行间，发现思想的智慧与力量。
                  </p>
                  
                  <div className="flex justify-end items-center">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={(e) => handleButtonClick(e, '/after-scene/books')}
                    >
                      进入书页留思
                    </Button>
                  </div>
                </div>
                  </div>
            </div>

            {/* 光影随想 - 投影仪设计 */}
            <div className="relative">
              <div className="flex items-center flex-row-reverse">
                {/* 右侧投影仪展示区域 */}
                <div className="w-5/12 pl-6 relative" onClick={() => handleCardClick('/after-scene/movies')}>
                  <div className="relative perspective-1000 transform-gpu transition-all duration-500 hover:scale-105 cursor-pointer h-72">
                    {/* 投影仪主体 */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-red-900/70 to-red-950/90 rounded-lg shadow-xl overflow-hidden"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: 'rotateY(-15deg) rotateX(5deg)'
                      }}
                    >
                      {/* 投影机镜头效果 */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-orange-300 to-orange-100 rounded-full border-2 border-orange-400 shadow-inner shadow-orange-300/50 z-10"></div>
                      
                      {/* 投影画面 */}
                      <div className="absolute inset-0 flex items-center justify-center p-5">
                        <div className="w-full h-full relative overflow-hidden rounded border-4 border-red-800/50 bg-black/50">
                          <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${featuredMovie.coverImage})` }}></div>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-red-950/90"></div>
                          
                          {/* 胶片效果条纹 */}
                          <div className="absolute inset-0 overflow-hidden opacity-20">
                            <div className="h-full w-full flex flex-col justify-between">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="h-px bg-white"></div>
                              ))}
            </div>
          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="text-xl font-bold mb-1 line-clamp-1">光影随想</h3>
                            <p className="text-sm opacity-90 line-clamp-2">影像，思索，感悟</p>
                          </div>
                          
                          {/* 移除影评标签 */}
                          
                          {/* 播放图标 */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-50 hover:opacity-80 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-red-500/50 flex items-center justify-center">
                              <Play className="h-6 w-6 text-white fill-current" />
                      </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 投影光线效果 */}
                      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-24 h-12 bg-gradient-to-r from-orange-500/40 to-transparent transform skew-y-12 -translate-y-6 blur-sm"></div>
                        </div>
                    
                    {/* 投影仪底座 */}
                    <div 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-red-950 rounded-full shadow-lg opacity-50"
                    ></div>
                      </div>
                </div>
                
                {/* 左侧内容区域 */}
                <div className="w-7/12 pr-8 py-4 bg-gradient-to-l from-red-50/70 to-transparent dark:from-red-950/20 dark:to-transparent rounded-l-xl">
                  <div className="mb-1 flex items-center">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 mr-3">光影随想</h2>
                    <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white">影视评论</Badge>
              </div>

                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Film className="h-3 w-3 mr-1 text-red-500" />
                    <span className="font-medium">观影收获:</span>
                    <span className="ml-1 text-xs">感知艺术，共情故事，引发思考</span>
                      </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    这里分享观影后的情感共鸣与批判思考，探讨电影如何通过视听语言讲述故事，传递理念。在光影交错中，体验多元的人生与情感。
                  </p>
                  
                  <div className="flex justify-end items-center">
                          <Button 
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                      onClick={(e) => handleButtonClick(e, '/after-scene/movies')}
                          >
                      进入光影随想
                          </Button>
                        </div>
                </div>
              </div>
            </div>
          </div>

          {/* 内容区域结束 */}
        </div>
      </div>
    </div>
  );
} 