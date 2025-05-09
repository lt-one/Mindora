"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { BlogPost } from "@/types/blog";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

interface FeaturedPostsCarouselProps {
  posts: BlogPost[];
  autoplayInterval?: number;
}

export default function FeaturedPostsCarouselShadcn({
  posts,
  autoplayInterval = 5000,
}: FeaturedPostsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // 监听轮播图API变化和选中项变化
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // 清除事件监听
    return () => {
      api.off("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    };
  }, [api]);

  // 如果没有文章或文章数量为0，则不显示轮播图
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto mb-10">
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: autoplayInterval,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {posts.map((post) => (
              <CarouselItem key={post.id}>
                <div className="relative overflow-hidden rounded-xl h-[400px] w-full shadow-lg">
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      priority={current === posts.indexOf(post)}
                    />
                    
                    {/* 文章信息叠加层 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white max-w-full overflow-hidden">
                        <span className="bg-blue-600 text-xs font-semibold px-2.5 py-1 rounded-md mb-3 inline-block">
                          {post.categories.length > 0 
                            ? post.categories[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
                            : '文章'}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2 break-words">{post.title}</h3>
                        <p className="text-sm md:text-base line-clamp-2 text-gray-200 mb-2 break-words">{post.excerpt}</p>
                        <div className="flex items-center text-sm">
                          <Image 
                            src={post.author.avatar} 
                            alt={post.author.name} 
                            width={24} 
                            height={24} 
                            className="rounded-full mr-2"
                          />
                          <span className="mr-3 truncate">{post.author.name}</span>
                          <span className="truncate">{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* 自定义导航按钮 */}
          <CarouselPrevious className="left-4 bg-black/30 hover:bg-black/50 text-white border-none backdrop-blur-sm" />
          <CarouselNext className="right-4 bg-black/30 hover:bg-black/50 text-white border-none backdrop-blur-sm" />
        </Carousel>
        
        {/* 指示器 */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current 
                  ? "bg-white scale-110" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`转到第 ${index + 1} 篇文章`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 