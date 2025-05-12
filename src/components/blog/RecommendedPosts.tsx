import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Eye, Flame, Sparkles, ThumbsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/utils";

interface RecommendedPostsProps {
  popularPosts: BlogPost[];
  latestPosts: BlogPost[];
  featuredPosts: BlogPost[];
}

export default function RecommendedPosts({
  popularPosts,
  latestPosts,
  featuredPosts,
}: RecommendedPostsProps) {
  return (
    <div className="mb-10">
      <Tabs defaultValue="popular" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
            <span>探索更多</span>
          </h3>
          <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
            <TabsTrigger value="popular" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <Flame className="w-4 h-4 mr-2 text-orange-500" />
              热门文章
            </TabsTrigger>
            <TabsTrigger value="latest" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <Clock className="w-4 h-4 mr-2 text-green-500" />
              最新文章
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
              精选文章
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="popular" className="rounded-md mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularPosts.map((post) => (
              <RecommendPostCard 
                key={post.id} 
                post={post} 
                metric={`${post.viewCount} 次阅读`}
                icon={<Eye className="w-3.5 h-3.5 text-orange-500" />}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="latest" className="rounded-md mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestPosts.map((post) => (
              <RecommendPostCard 
                key={post.id} 
                post={post} 
                metric={formatDate(post.publishedAt)}
                icon={<Clock className="w-3.5 h-3.5 text-green-500" />}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="rounded-md mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredPosts.map((post) => (
              <RecommendPostCard 
                key={post.id} 
                post={post} 
                metric={`${post.likeCount} 次点赞`} 
                icon={<ThumbsUp className="w-3.5 h-3.5 text-purple-500" />}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RecommendPostCard({ 
  post, 
  metric, 
  icon 
}: { 
  post: BlogPost; 
  metric: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative group overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* 文章缩略图 */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>
        
        {/* 标签 */}
        {post.categories.length > 0 && (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-blue-600/90 text-white rounded backdrop-blur-sm">
            {post.categories[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        )}
      </div>
      
      {/* 文章信息 */}
      <div className="p-4">
        <Link href={`/blog/${post.slug}`} className="block">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h4>
        </Link>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            <span>{post.readingTime}</span>
          </div>
          <div className="flex items-center">
            {icon}
            <span className="ml-1">{metric}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 