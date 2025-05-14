import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Star,
  BookOpen,
  Quote,
  Tag,
  Bookmark,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// 这只是一个示例，实际应用中应该从数据库或API获取
const getBookReview = (slug: string) => {
  // 模拟数据库查询
  const reviews = [
    {
      id: '1',
      title: '《百年孤独》：魔幻现实中的人性探索',
      slug: 'one-hundred-years-of-solitude',
      coverImage: '/images/blog/PlaceImage.png',
      author: '加西亚·马尔克斯',
      publisher: '南海出版公司',
      publishYear: '2011',
      category: '文学',
      tags: ['魔幻现实主义', '家族史诗', '拉美文学'],
      publishedAt: '2023-12-01',
      readingStartDate: '2023-11-01',
      readingEndDate: '2023-11-25',
      readingContext: '夜间阅读，伴随着雨声',
      readingTime: 24, // 小时
      excerpt: '在马孔多这个被遗忘的小镇，布恩迪亚家族上演了一出跨越百年的人性悲喜剧...',
      content: `
      <p>马尔克斯的《百年孤独》是一部魔幻现实主义的经典杰作，讲述了布恩迪亚家族七代人的故事。从何塞·阿卡迪奥·布恩迪亚创建马孔多小镇开始，到最后一个布恩迪亚被飓风吹走，整个家族的历史就像一个巨大的圆环，充满了宿命的色彩。</p>
      
      <h2>阅读体验：时间的魔术</h2>
      <p>阅读《百年孤独》的过程如同进入一个梦境。马尔克斯以精湛的叙事技巧，将魔幻与现实交织在一起。时间在这本书中不再是线性的，而是像一条蜿蜒的河流，时而向前，时而回环。人物的名字一再重复，命运也似乎在循环往复，这种循环让整个阅读体验充满了迷幻色彩。</p>
      
      <blockquote>
        "时间很难捉摸，然而，在马孔多，那些怀表和时钟早就停摆了许多年。"
      </blockquote>
      
      <p>当我读到乌尔苏拉迷失在自己家中的片段时，那种时间带来的混乱和衰老的无情，给我留下了深刻的印象。马尔克斯以一种近乎残酷的方式展示了时间对人的侵蚀。</p>
      
      <h2>孤独的主题：灵魂的离散</h2>
      <p>正如书名所揭示的，孤独是这部作品的核心主题。每一个布恩迪亚家族的成员，无论是沉迷于炼金术的何塞·阿卡迪奥，还是带领起义军的奥雷里亚诺上校，最终都无法逃脱孤独的命运。</p>
      
      <p>令人惊讶的是，这种孤独并非来自物理上的隔离，而是源于无法与他人真正沟通、理解和共情的内在隔阂。阿玛兰妲与盖梅尔金多的故事尤其体现了这一点——即使身体亲密，灵魂却始终保持着距离。</p>
      
      <h2>历史与记忆：现实的魔幻</h2>
      <p>这本书以魔幻手法描绘了哥伦比亚乃至整个拉丁美洲的历史，特别是那些被官方历史叙事遗忘的部分。比如书中描述的香蕉公司大屠杀，就是基于1928年哥伦比亚实际发生的事件，但在官方历史中几乎被抹去。</p>
      
      <blockquote>
        "世界上的事物在不停地重演；是同样的白日，同样的云彩，同样的爱情，同样的仇恨，同样的欢乐，同样的悲伤。"
      </blockquote>
      
      <p>梅尔基亚德斯的羊皮纸预言了家族的历史，这不仅是一种文学技巧，也暗示了历史的周期性和宿命性。这让我思考：我们是否也生活在某种无法逃脱的历史循环中？</p>
      
      <h2>阅读收获：文学的边界</h2>
      <p>阅读《百年孤独》让我重新思考了文学的可能性。马尔克斯打破了现实与幻想的界限，创造了一种全新的叙事方式。在这个世界里，人可以升天，死者可以回来，蝴蝶可以成群出现——这些魔幻元素不仅不显得突兀，反而成为了表达深层现实的手段。</p>
      
      <p>最让我震撼的是，马尔克斯用如此丰富的想象力和语言魔力，揭示了人类存在的普遍性。无论文化背景如何不同，孤独、死亡、爱与遗忘都是每个人共同面对的命题。</p>
      
      <h2>结语：消逝与永恒</h2>
      <p>当最后一个布恩迪亚被风吹走，马孔多从地图上消失时，我感到一种深深的伤感。但同时，通过阅读，这个小镇和它的居民却在我的记忆中获得了永生。这或许就是文学的力量——将逝去的事物转化为永恒。</p>
      
      <p>《百年孤独》教会我，人类的命运或许注定孤独，但正是这种孤独推动我们不断寻求连接，创造故事，在记忆与想象的交织中延续生命的意义。</p>
      `,
      favoriteQuotes: [
        "多年以后，奥雷里亚诺上校站在行刑队面前，准会想起父亲带他去见识冰块的那个遥远的下午。",
        "时间很难捉摸，然而，在马孔多，那些怀表和时钟早就停摆了许多年。",
        "世界上的事物在不停地重演；是同样的白日，同样的云彩，同样的爱情，同样的仇恨，同样的欢乐，同样的悲伤。",
      ],
      relatedBooks: [
        { title: "霍乱时期的爱情", author: "加西亚·马尔克斯" },
        { title: "魔山", author: "托马斯·曼" },
        { title: "喧嚣与骚动", author: "威廉·福克纳" },
      ],
    },
  ];

  const review = reviews.find((r) => r.slug === slug);
  if (!review) return null;
  return review;
};

// 修改参数类型为 Promise
type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const review = getBookReview(slug);
  if (!review) {
    return {
      title: '未找到 | 书页留思',
    };
  }

  return {
    title: `${review.title} | 书页留思`,
    description: review.excerpt,
  };
}

export default async function BookReviewPage({ params }: { params: Params }) {
  const { slug } = await params;
  const review = getBookReview(slug);
  
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
            href="/after-scene/books" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            书页留思
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
            <Link href="/after-scene/books" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>返回书页留思</span>
            </Link>
          </Button>
        </div>

        {/* 书籍信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* 左侧：封面和基本信息 */}
          <div className="md:col-span-1">
            <Card className="border-2 overflow-hidden">
              <div className="relative aspect-[2/3] bg-muted">
                <Image
                  src={review.coverImage}
                  alt={review.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground font-medium">作者</div>
                  <div>{review.author}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground font-medium">出版信息</div>
                  <div>{review.publisher}，{review.publishYear}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground font-medium">分类</div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{review.category}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground font-medium">标签</div>
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
              </CardContent>
            </Card>
          </div>

          {/* 右侧：文章内容 */}
          <div className="md:col-span-2">
            {/* 文章标题和元信息 */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif mb-3">
                {review.title}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>发布于 {new Date(review.publishedAt).toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>阅读时间约 {review.readingTime} 小时</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>
                    阅读时段：
                    {new Date(review.readingStartDate).toLocaleDateString('zh-CN')} 
                    至 
                    {new Date(review.readingEndDate).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>

            {/* 阅读旅程卡片 */}
            <Card className="mb-8 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">阅读旅程</h3>
                </div>
                
                <div className="relative pl-6 pb-1 border-l-2 border-primary/20">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <p className="text-sm font-medium">
                    开始阅读：{new Date(review.readingStartDate).toLocaleDateString('zh-CN')}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{review.readingContext}</p>
                  
                  <div className="absolute left-[-8px] bottom-0 w-4 h-4 rounded-full bg-primary"></div>
                  <p className="text-sm font-medium">
                    完成阅读：{new Date(review.readingEndDate).toLocaleDateString('zh-CN')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    总阅读时间：约 {review.readingTime} 小时
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 文章内容 */}
            <div 
              className="prose prose-stone dark:prose-invert max-w-none mb-10" 
              dangerouslySetInnerHTML={{ __html: review.content }}
            />

            {/* 精彩引用 */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Quote className="h-5 w-5 mr-2 text-primary" />
                精彩引用
              </h3>
              <div className="space-y-4">
                {review.favoriteQuotes.map((quote, index) => (
                  <blockquote 
                    key={index}
                    className="pl-4 border-l-4 border-primary/30 italic text-muted-foreground"
                  >
                    {quote}
                  </blockquote>
                ))}
              </div>
            </div>

            {/* 延伸阅读 */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Bookmark className="h-5 w-5 mr-2 text-primary" />
                延伸阅读
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {review.relatedBooks.map((book, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-muted-foreground">{book.author}</div>
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
        </div>

        {/* 导航栏 */}
        <div className="border-t pt-8 mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Button variant="outline" size="sm" asChild className="mb-4 sm:mb-0 w-full sm:w-auto">
              <Link href="/after-scene/books">
                <ChevronLeft className="mr-1 h-4 w-4" />
                返回书页留思
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