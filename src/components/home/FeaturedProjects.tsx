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

// 示例项目数据
const projectsData = [
  {
    id: "1",
    title: "华为终端舆情监测分析",
    description: "全网监测华为品牌相关信息，预警舆情风险，输出数据报告，支持产品迭代",
    // 使用本地图片路径
    image: "/images/projects/sentiment-analysis-cover.png",
    tags: ["Python", "AI大模型", "数据分析"],
    slug: "huawei-sentiment-analysis",
    featured: true,
    highlightColor: "from-blue-500 to-indigo-500",
  },
  {
    id: "2",
    title: "脑机接口灯光控制系统",
    description: "通过脑电采集头环监控脑电信号，检测注意力水平，自动调节室内灯光亮度",
    // 使用本地图片路径
    image: "/images/projects/brain-interface-cover.png",
    tags: ["脑机接口", "Python", "鸿蒙ArkTs"],
    slug: "brain-interface-lighting",
    featured: true,
    highlightColor: "from-purple-500 to-pink-500",
  },
  {
    id: "3",
    title: "数据可视化平台",
    description: "交互式数据可视化平台，实时监控和分析关键业务指标，支持多种图表类型",
    // 使用本地图片路径
    image: "/images/projects/data-visualization-cover.png",
    tags: ["Tableau", "Python", "数据可视化"],
    slug: "data-visualization",
    featured: false,
    highlightColor: "from-green-500 to-emerald-500",
  },
  {
    id: "4",
    title: "AI辅助产品设计工具",
    description: "结合大模型和UI设计原则，自动生成界面原型和产品设计方案",
    // 使用本地图片路径
    image: "/images/projects/ai-design-cover.png",
    tags: ["AI", "产品设计", "UI/UX"],
    slug: "ai-design-tool",
    featured: false,
    highlightColor: "from-rose-500 to-red-500",
  },
];

const FeaturedProjects = () => {
  const [mounted, setMounted] = useState(false);
  const featuredProjects = projectsData.filter(project => project.featured);
  const regularProjects = projectsData.filter(project => !project.featured);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免水合不匹配
  if (!mounted) {
    return null;
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
              {featuredProjects.map((project) => (
                <CarouselItem key={project.id}>
                  <div className="relative h-[450px] w-full overflow-hidden rounded-xl">
                    <Image
                      src={project.image}
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
                              {project.tags.map(tag => (
                                <Badge key={tag} className="bg-blue-600 text-xs font-medium rounded-full text-white hover:bg-blue-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h4 className="text-3xl md:text-4xl font-bold">{project.title}</h4>
                            <p className="text-lg opacity-90">{project.description}</p>
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
        <div className="mt-16">
          <div className="flex items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">其他项目</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                  <div className="absolute top-0 right-0 p-4">
                    <div className="flex gap-2">
                      {project.tags.slice(0, 2).map(tag => (
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
                    {project.description}
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