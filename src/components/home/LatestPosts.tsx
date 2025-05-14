"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, Clock, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 示例博客文章数据
const postsData = [
  {
    id: "1",
    title: "大学反思：四年成长路的关键转折点",
    slug: "university-reflection",
    excerpt: "分享我在大学四年间的学习经历、成长转折点以及对未来职业发展的思考。如何在大学期间找到自己的方向和兴趣所在。",
    featuredImage: "/images/placeholders/site-placeholder.jpg/university-reflection.png",
    publishedAt: "2023-12-15",
    readingTime: "8 分钟",
    categories: ["个人成长"],
    tags: ["大学生活", "职业规划", "自我成长"],
  },
  {
    id: "2",
    title: "为什么选择换赛道：从传统行业到AI数据分析",
    slug: "career-path-change",
    excerpt: "详述我从传统行业转向AI数据分析领域的决策过程、面临的挑战以及转型过程中的经验教训与实用建议。",
    featuredImage: "/images/placeholders/site-placeholder.jpg/career-change.png",
    publishedAt: "2023-11-20",
    readingTime: "10 分钟",
    categories: ["职业发展"],
    tags: ["职业转型", "数据分析", "AI行业"],
  },
  {
    id: "3",
    title: "第一份工作总结复盘：成长与挑战",
    slug: "first-job-review",
    excerpt: "回顾我的第一份数据分析工作，分享职场新人的适应过程、技能提升历程以及如何从错误中学习和成长的实践经验。",
    featuredImage: "/images/placeholders/site-placeholder.jpg/first-job.png",
    publishedAt: "2023-10-10",
    readingTime: "12 分钟",
    categories: ["职业发展"],
    tags: ["职场经验", "数据分析师", "自我提升"],
  },
  {
    id: "4",
    title: "建站目的及过程分享：从想法到实现",
    slug: "website-building-journey",
    excerpt: "详细记录个人网站从构思到上线的全过程，包括技术选型、设计决策、遇到的问题及解决方案，以及个人建站的经验与技巧。",
    featuredImage: "/images/placeholders/site-placeholder.jpg/website-building.png",
    publishedAt: "2023-09-05",
    readingTime: "7 分钟",
    categories: ["技术分享"],
    tags: ["网站开发", "Next.js", "个人项目"],
  },
];

// 获取所有分类
const allCategories = [...new Set(postsData.map(post => post.categories[0]))];

const LatestPosts = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // 根据分类过滤文章
  const filteredPosts = activeCategory === "all" 
    ? postsData 
    : postsData.filter(post => post.categories.includes(activeCategory));

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            最新文章
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            分享个人成长历程、职业发展思考、技术探索与AI工具使用心得，记录从校园到职场的点滴感悟
          </p>
        </div>

        {/* 分类过滤器 */}
        <div className="flex justify-center mb-8">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList>
              <TabsTrigger value="all">全部文章</TabsTrigger>
              {allCategories.map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300">
              <Link href={`/blog/${post.slug}`} className="block cursor-pointer">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-0 right-0 m-3">
                    <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">
                      {post.categories[0]}
                    </Badge>
                  </div>
                </div>
              </Link>

              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg md:text-xl font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 flex-grow">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm">
                  {post.excerpt}
                </p>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge variant="outline" key={tag} className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />{tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" asChild className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                  <Link href={`/blog/${post.slug}`}>
                    阅读更多
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link href="/blog" className="flex items-center space-x-2">
              <span>浏览更多文章</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts; 