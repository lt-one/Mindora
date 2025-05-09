"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Bookmark, Award, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

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
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const featuredProjects = projectsData.filter(project => project.featured);

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);

  // 自动轮播功能
  useEffect(() => {
    if (autoplay && isVisible) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % featuredProjects.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoplay, isVisible, featuredProjects.length]);
  
  // 悬停时暂停自动轮播
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // 背景动画元素
  const BgElement = ({ className }: { className: string }) => (
    <motion.div 
      className={`absolute rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl opacity-70 ${className}`}
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity,
        repeatType: "reverse" 
      }}
    />
  );

  return (
    <section
      id="featured-projects"
      ref={sectionRef}
      className="py-24 relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      {/* 增强背景装饰效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <BgElement className="w-96 h-96 -top-24 -right-24 bg-blue-100 dark:bg-blue-900/20" />
        <BgElement className="w-96 h-96 -bottom-24 -left-24 bg-purple-100 dark:bg-purple-900/20" />
        <BgElement className="w-64 h-64 top-1/3 left-1/4 bg-indigo-100 dark:bg-indigo-900/20" />
        <motion.div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase dark:text-blue-400">我的项目</span>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            精选<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">项目</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            这些项目展示了我在数据分析、AI应用和产品设计方面的能力与经验
          </p>
          <motion.div 
            className="mt-6"
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded mx-auto"></div>
          </motion.div>
        </motion.div>

        {isVisible && (
          <>
            {/* 精选项目轮播 */}
            <div 
              className="mb-16 relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.h3 
                className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                重点项目展示
              </motion.h3>
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <div className="relative h-[500px] w-full">
                      <Image
                        src={featuredProjects[activeIndex].image}
                        alt={featuredProjects[activeIndex].title}
                        className="object-cover"
                        fill
                        priority
                        sizes="(max-width: 1200px) 100vw, 1200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r opacity-80"
                           style={{
                             backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3))`,
                           }}
                      />
                    </div>

                    <div className="absolute inset-0 flex items-center">
                      <div className="container mx-auto px-8 md:px-16">
                        <motion.div 
                          className="max-w-2xl text-white"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.7 }}
                        >
                          <div className="mb-4">
                            {featuredProjects[activeIndex].tags.map(tag => (
                              <span key={tag} className={`mr-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${featuredProjects[activeIndex].highlightColor} text-white`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-4xl md:text-5xl font-bold mb-6">{featuredProjects[activeIndex].title}</h3>
                          <p className="text-lg md:text-xl opacity-90 mb-8">{featuredProjects[activeIndex].description}</p>
                          <Link
                            href={`/projects/${featuredProjects[activeIndex].slug}`}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:translate-y-[-2px]"
                          >
                            查看详情
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* 导航按钮 */}
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={() => setActiveIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length)}
                    className="bg-black/30 hover:bg-black/50 text-white rounded-r-lg p-2 backdrop-blur-sm transition-all ml-2"
                    aria-label="上一个项目"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => setActiveIndex((prev) => (prev + 1) % featuredProjects.length)}
                    className="bg-black/30 hover:bg-black/50 text-white rounded-l-lg p-2 backdrop-blur-sm transition-all mr-2"
                    aria-label="下一个项目"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* 指示器 */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {featuredProjects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        activeIndex === index
                          ? "w-8 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`转到项目 ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 所有项目网格 */}
            <motion.h3 
              className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Bookmark className="w-5 h-5 mr-2 text-blue-500" />
              所有项目
            </motion.h3>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {projectsData.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10, 
                    transition: { duration: 0.3 } 
                  }}
                >
                  <Link href={`/projects/${project.slug}`}>
                    <div
                      className="group h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="relative h-60 w-full overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          priority={index < 2}
                        />
                        {project.featured && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            精选项目
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                          <span className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </span>
                          <span className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full">
                            <Github className="w-4 h-4 text-white" />
                          </span>
                          <span className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full">
                            <Bookmark className="w-4 h-4 text-white" />
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2.5 py-0.5 rounded-full`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-16"
        >
          <Link
            href="/projects"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            查看更多项目
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects; 