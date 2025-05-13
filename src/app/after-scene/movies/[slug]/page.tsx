import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Star,
  Film,
  Quote,
  Tag,
  Play,
  User,
  Music,
  Camera,
  ThumbsUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 这只是一个示例，实际应用中应该从数据库或API获取
const getMovieReview = (slug: string) => {
  // 模拟数据库查询
  const reviews = [
    {
      id: '1',
      title: '《盗梦空间》：潜意识迷宫中的现实探寻',
      slug: 'inception',
      coverImage: '/images/blog/PlaceImage.png',
      director: '克里斯托弗·诺兰',
      actors: ['莱昂纳多·迪卡普里奥', '约瑟夫·高登-莱维特', '艾伦·佩吉', '汤姆·哈迪'],
      releaseYear: '2010',
      category: '科幻',
      tags: ['梦境', '现实与虚幻', '心理悬疑', '时间扭曲'],
      technicalRating: {
        directing: 10,
        screenplay: 9.5,
        cinematography: 10,
        acting: 9.5,
        soundtrack: 10,
        visualEffects: 9.8
      },
      publishedAt: '2023-12-05',
      watchDate: '2023-11-20',
      rewatchCount: 3,
      watchContext: '家庭影院，夜间观影',
      duration: 148,
      excerpt: '诺兰构建了一个关于梦境嵌套的精妙世界，在视觉奇观背后探讨了记忆、创伤与现实的本质...',
      content: `
      <p>克里斯托弗·诺兰的《盗梦空间》是一部关于梦境、现实与潜意识的科幻杰作。影片讲述了专业"盗梦者"多姆·科布（莱昂纳多·迪卡普里奥 饰）和他的团队通过潜入他人梦境窃取或植入想法的故事。在这次任务中，他们需要完成一个前所未有的挑战：不是窃取想法，而是植入一个想法——"始发"。</p>
      
      <h2>叙事结构：梦中梦的迷宫</h2>
      <p>《盗梦空间》最令人叹为观止的是其复杂而精确的叙事结构。诺兰构建了一个多层次的梦境世界，每一层都有其独特的规则和时间流速。影片的后半部分同时在四个不同层次的现实/梦境中切换，这种叙事技巧要求观众全神贯注，但同时也带来了前所未有的观影体验。</p>
      
      <p>有趣的是，这种梦中梦的结构不仅仅是一种炫技，而是完美服务于影片的主题：我们如何区分现实与梦境？记忆和情感如何塑造我们的现实感知？这些深层次的哲学探讨被巧妙地融入了一个引人入胜的动作冒险故事中。</p>
      
      <blockquote>
        "你在等一班永远不会到站的火车吗？"
      </blockquote>
      
      <h2>视觉语言：梦境的物理规则</h2>
      <p>诺兰与摄影师沃利·菲斯特合作，创造了一些最具标志性的视觉场景——旋转走廊、折叠城市、零重力战斗。这些震撼的视觉效果不仅仅是为了视觉冲击，而是通过物理规则的扭曲来表现梦境的非理性特性。</p>
      
      <p>特别令人印象深刻的是，诺兰尽可能使用实际特效而非CGI。旋转走廊场景是在一个真实旋转的装置中拍摄的，这不仅带来了真实感，也展示了诺兰对电影工艺的执着追求。</p>
      
      <h2>情感核心：记忆与愧疚</h2>
      <p>在所有的技术成就之下，《盗梦空间》的情感核心是科布与其已故妻子梅尔的故事。科布无法面对自己在妻子死亡中所扮演的角色，这种愧疚和未解决的情感创伤在他的潜意识中具象化，成为一个危险的幽灵，不断破坏他的任务和生活。</p>
      
      <p>最终，影片不仅仅是关于在他人梦中植入想法，还是关于科布如何与自己的过去和解。这个个人救赎的故事赋予了这部科幻影片深刻的人文深度。</p>
      
      <h2>音乐：时间与情感的编织</h2>
      <p>汉斯·季默的配乐是《盗梦空间》不可或缺的元素。特别是那个标志性的"BRAAAM"音效和缓慢版本的《Non, Je Ne Regrette Rien》，完美地强化了影片的情感基调和悬疑气氛。</p>
      
      <p>季默使用了"时间拉伸"的音乐技巧，这与影片中梦境层次越深时间流速越慢的概念完美呼应。这种声音与叙事的和谐统一是电影艺术的最高境界之一。</p>
      
      <blockquote>
        "梦的建筑师从不留恋于回忆。"
      </blockquote>
      
      <h2>开放式结局：现实的陀螺</h2>
      <p>影片的结尾——陀螺是否停止旋转——是电影史上最具争议的开放式结局之一。诺兰巧妙地在为观众提供满足感的同时，保留了解释的空间。这个开放式结局不仅符合影片的主题——现实的主观性，也让电影在结束后继续在观众心中旋转，就像科布的陀螺。</p>
      
      <p>我个人的理解是，结局的重点不在于科布是否真的回到了现实，而在于他不再关心陀螺是否会倒下——他选择了接受当下的幸福，无论它是现实还是梦境。</p>
      
      <h2>观影体验与思考</h2>
      <p>《盗梦空间》是一部需要多次观看的电影。每次重看，我都能发现新的细节和深层含义。它挑战了观众的注意力和理解力，但也因此带来了更丰富的观影回报。</p>
      
      <p>这部电影让我思考：我们如何定义现实？我们的记忆和情感如何影响我们对现实的感知？如果一个梦足够真实，它和现实有什么区别？这些问题没有简单的答案，但《盗梦空间》以一种引人入胜的方式提出了这些哲学思辨。</p>
      
      <h2>结语：梦之旅程</h2>
      <p>《盗梦空间》展示了克里斯托弗·诺兰作为电影创作者的巅峰水平。它完美地平衡了概念的复杂性和情感的共鸣，技术的创新和叙事的传统，视觉的壮观和主题的深度。</p>
      
      <p>这部电影不仅是一次关于梦境的壮观旅程，也是一次关于电影本身魔力的庆祝——电影作为一种集体梦境的能力，能够让我们体验其他现实，探索内心深处的情感和思想。</p>
      `,
      keyScenes: [
        {
          title: "折叠巴黎场景",
          description: "阿里阿德妮在梦中折叠巴黎街道，展示了梦境建筑师扭曲物理规则的能力，视觉效果令人震撼。",
          timestamp: "00:32:15"
        },
        {
          title: "零重力走廊战斗",
          description: "亚瑟在酒店梦境中进行的走廊打斗，由于上层梦境中的面包车翻滚，导致这一层的重力不断变化。",
          timestamp: "01:43:20"
        },
        {
          title: "积雪要塞突袭",
          description: "第三层梦境中的雪山要塞攻击场景，团队必须在时间限制内完成任务，展现了平行剪辑的巅峰运用。",
          timestamp: "02:05:30"
        },
      ],
      relatedMovies: [
        { title: "记忆碎片", director: "克里斯托弗·诺兰" },
        { title: "黑客帝国", director: "沃卓斯基姐妹" },
        { title: "潜行者", director: "安德烈·塔可夫斯基" },
      ],
    },
  ];

  const review = reviews.find((r) => r.slug === slug);
  if (!review) return null;
  return review;
};

// 动态生成元数据
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const review = getMovieReview(params.slug);
  if (!review) {
    return {
      title: '未找到 | 光影随想',
    };
  }

  return {
    title: `${review.title} | 光影随想`,
    description: review.excerpt,
  };
}

export default function MovieReviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const review = getMovieReview(params.slug);
  
  if (!review) {
    notFound();
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-12">
        {/* 面包屑导航 - 更加醒目 */}
        <div className="flex items-center text-sm mb-6 bg-muted/50 p-2 rounded-md w-fit">
          <Link 
            href="/after-scene" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            散场之后
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link 
            href="/after-scene/movies" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            光影随想
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="font-medium truncate max-w-[200px]">{review.title}</span>
        </div>

        {/* 返回按钮 - 优化设计 */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Link href="/after-scene/movies" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>返回光影随想</span>
            </Link>
          </Button>
        </div>

        {/* 影片封面和基本信息 */}
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl mb-10">
          <Image
            src={review.coverImage}
            alt={review.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex items-start justify-between">
                <div className="max-w-2xl">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {review.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{review.director}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{review.releaseYear}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{review.duration} 分钟</span>
                    </div>
                    <div className="flex items-center">
                      <Film className="h-4 w-4 mr-1" />
                      <span>{review.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="bg-white/10 hover:bg-white/20 border-none text-white"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
              </div>
              <Button 
                className="mt-4 bg-primary/90 hover:bg-primary flex items-center"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                观看预告片
              </Button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左侧：内容主体 */}
          <div className="md:col-span-2">
            {/* 观影信息 */}
            <Card className="mb-8 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Film className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">观影体验</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">观影日期：</span>
                    <span className="text-sm">{new Date(review.watchDate).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">重看次数：</span>
                    <span className="text-sm">{review.rewatchCount} 次</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">观影环境：</span>
                    <span className="text-sm">{review.watchContext}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 文章内容 */}
            <div 
              className="prose prose-stone dark:prose-invert max-w-none mb-10" 
              dangerouslySetInnerHTML={{ __html: review.content }}
            />

            {/* 关键场景分析 */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-primary" />
                关键场景分析
              </h3>
              <div className="space-y-4">
                {review.keyScenes.map((scene, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="p-4 sm:p-5 flex-1">
                        <h4 className="font-medium text-lg mb-1">{scene.title}</h4>
                        <div className="text-sm text-muted-foreground mb-2">
                          时间码：{scene.timestamp}
                        </div>
                        <p className="text-sm">{scene.description}</p>
                      </div>
                      <div className="bg-primary/10 p-4 sm:p-5 sm:w-[140px] flex items-center justify-center">
                        <div className="rounded-full bg-primary/20 hover:bg-primary/30 transition-colors p-3 cursor-pointer">
                          <Play className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 相关影片推荐 */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Film className="h-5 w-5 mr-2 text-primary" />
                相关影片推荐
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {review.relatedMovies.map((movie, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="font-medium">{movie.title}</div>
                      <div className="text-sm text-muted-foreground">{movie.director}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 底部标签 */}
            <div className="flex items-center gap-2 mb-10">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground mr-2">标签：</div>
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* 分享和互动按钮 */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Button variant="outline" size="sm">
                分享本文
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  点赞
                </Button>
                <Button variant="ghost" size="sm">
                  收藏
                </Button>
              </div>
            </div>
          </div>

          {/* 右侧：演员、评分、制作信息等 */}
          <div className="md:col-span-1">
            

            {/* 制作人员 */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">制作人员</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">导演</div>
                  <div>{review.director}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">主要演员</div>
                  <div className="space-y-1">
                    {review.actors.map((actor, index) => (
                      <div key={index} className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>{actor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 技术评分卡片 */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">技术评分</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(review.technicalRating).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm capitalize">
                        {key === 'directing' ? '导演' : 
                         key === 'screenplay' ? '剧本' : 
                         key === 'cinematography' ? '摄影' : 
                         key === 'acting' ? '演技' : 
                         key === 'soundtrack' ? '配乐' : 
                         key === 'visualEffects' ? '视觉效果' : key}
                      </span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(value / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 发布信息 */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-2">评论发布于</div>
                <div>{new Date(review.publishedAt).toLocaleDateString('zh-CN')}</div>
              </CardContent>
            </Card>

            {/* 内容导航 */}
            <div className="sticky top-20">
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium">内容导航</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#" className="text-primary hover:underline">叙事结构：梦中梦的迷宫</a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary transition-colors">视觉语言：梦境的物理规则</a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary transition-colors">情感核心：记忆与愧疚</a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary transition-colors">音乐：时间与情感的编织</a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary transition-colors">开放式结局：现实的陀螺</a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary transition-colors">观影体验与思考</a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 导航栏 */}
        <div className="border-t pt-8 mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Button variant="outline" size="sm" asChild className="mb-4 sm:mb-0 w-full sm:w-auto">
              <Link href="/after-scene/movies">
                <ChevronLeft className="mr-1 h-4 w-4" />
                返回光影随想
              </Link>
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-1/2 sm:w-auto">
                上一篇
              </Button>
              <Button variant="outline" size="sm" className="w-1/2 sm:w-auto">
                下一篇
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 