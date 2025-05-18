"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Sparkles, ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";

// 初始状态：加载中
const initialState = {
  featuredProjects: [],
  regularProjects: [],
  isLoading: true,
  error: null
};

const FeaturedProjects = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<{
    featuredProjects: Project[];
    regularProjects: Project[];
    isLoading: boolean;
    error: string | null;
  }>(initialState);

  useEffect(() => {
    setMounted(true);
    
    // 获取项目数据
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        
        // 更新状态
        setState({
          featuredProjects: data.filter((project: Project) => project.featured),
          regularProjects: data.filter((project: Project) => !project.featured).slice(0, 4), // 只显示4个常规项目
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : '获取项目数据失败'
        }));
      }
    };
    
    fetchProjects();
  }, []);

  // 避免水合不匹配
  if (!mounted) {
    return null;
  }

  // 显示加载状态
  if (state.isLoading) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 w-48 mx-auto mb-4 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 w-96 mx-auto mb-6 rounded"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 w-full max-w-2xl mx-auto rounded"></div>
            
            <div className="mt-12 h-80 bg-gray-200 dark:bg-gray-700 w-full rounded-xl"></div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 显示错误信息
  if (state.error) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto text-center">
          <p className="text-red-500">获取项目数据出错: {state.error}</p>
        </div>
      </section>
    );
  }

  // 如果没有特色项目，显示备用消息
  if (state.featuredProjects.length === 0) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">暂无精选项目</h3>
          <Button asChild>
            <Link href="/projects">
              查看全部项目
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="featured-projects"
      className="py-20 relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bookmark className="h-5 w-5 text-blue-500" />
          <h2 className="text-sm font-medium text-blue-600 tracking-wider uppercase dark:text-blue-400">
            我的项目
          </h2>
          <Bookmark className="h-5 w-5 text-blue-500" />
        </div>
        
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            精选<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">项目</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            这些项目展示了我在数据分析、AI应用和产品设计方面的能力与经验
          </p>
        </div>

        {/* 精选项目轮播 */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              重点项目展示
            </h3>
          </div>
          
          <Carousel
            opts={{
              loop: true,
              align: "start",
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {state.featuredProjects.map((project) => (
                <CarouselItem key={project.id}>
                  <div className="relative h-[450px] w-full overflow-hidden rounded-xl">
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="object-cover"
                      fill
                      priority
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30">
                      <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-8 md:px-16">
                          <div className="max-w-xl text-white space-y-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.slice(0, 3).map(tag => (
                                <Badge key={tag} className="bg-blue-600 text-xs font-medium rounded-full text-white hover:bg-blue-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h4 className="text-3xl md:text-4xl font-bold">{project.title}</h4>
                            <p className="text-lg opacity-90">{project.summary}</p>
                            <Button asChild className="mt-4">
                              <Link href={`/projects/${project.slug}`}>
                                查看详情
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black/30 hover:bg-black/50 text-white border-none" />
            <CarouselNext className="right-4 bg-black/30 hover:bg-black/50 text-white border-none" />
          </Carousel>
        </div>

        {/* 其他项目展示 */}
        {state.regularProjects.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">其他项目</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.regularProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    />
                    <div className="absolute top-0 right-0 p-4">
                      <div className="flex gap-2">
                        {project.technologies.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-black/60 text-white text-xs hover:bg-black/70">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base line-clamp-2">
                      {project.summary}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <Button variant="outline" asChild size="sm">
                      <Link href={`/projects/${project.slug}`}>
                        查看详情
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/projects">
              查看全部项目
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects; 