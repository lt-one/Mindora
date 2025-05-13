"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  ArrowRight, 
  BarChart2, 
  Brain, 
  PieChart, 
  Compass,
  Sparkles,
  Zap
} from "lucide-react";

// 模拟数据 - 未来可从API获取
const toolsData = [
  {
    id: "1",
    title: "舆情分析仪表盘",
    description: "全网品牌提及监测和情感分析工具，支持实时预警和趋势可视化",
    icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
    color: "from-blue-500 to-indigo-700",
    gradient: "conic-gradient(at bottom left, rgb(59, 130, 246), rgb(79, 70, 229))",
    link: "/dashboard",
    status: "5000+",
    statusLabel: "日均数据处理",
  },
  {
    id: "2",
    title: "AI提示词生成器",
    description: "根据需求智能生成提示词模板，提升大模型输出质量和效率",
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    color: "from-purple-500 to-purple-800",
    gradient: "conic-gradient(at top right, rgb(168, 85, 247), rgb(107, 33, 168))",
    link: "/tools/prompt-generator",
    status: "65%",
    statusLabel: "效率提升",
  },
  {
    id: "3",
    title: "数据可视化模板",
    description: "多种数据图表模板，一键生成专业数据报告和可视化展示",
    icon: <PieChart className="w-6 h-6 text-green-500" />,
    color: "from-green-500 to-emerald-700",
    gradient: "conic-gradient(at center right, rgb(16, 185, 129), rgb(5, 150, 105))",
    link: "/tools/visualization",
    status: "25+",
    statusLabel: "图表类型",
  },
  {
    id: "4",
    title: "产品体验设计导航",
    description: "整合用户洞察和数据分析，辅助产品设计决策和用户体验优化",
    icon: <Compass className="w-6 h-6 text-red-500" />,
    color: "from-red-500 to-rose-700",
    gradient: "conic-gradient(at top center, rgb(244, 63, 94), rgb(159, 18, 57))",
    link: "/tools/product-design",
    status: "20+",
    statusLabel: "产品迭代案例",
  },
];

// 装饰元素数据
const decorations = [
  { top: "5%", left: "10%", size: 8, delay: 0, duration: 8 },
  { top: "15%", right: "10%", size: 12, delay: 1, duration: 10 },
  { top: "40%", right: "15%", size: 16, delay: 0.5, duration: 7 },
  { top: "60%", left: "5%", size: 10, delay: 2, duration: 9 },
  { top: "80%", right: "20%", size: 14, delay: 1.5, duration: 11 },
];

const ToolsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);

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

  // 为装饰元素创建动画
  const DecorativeElement = ({ top, left, right, size, delay, duration }: any) => (
    <motion.div
      className="absolute z-0 rounded-full opacity-50 blur-xl bg-gradient-to-r from-blue-400 to-purple-500"
      style={{ 
        top, 
        left, 
        right, 
        width: `${size}rem`,
        height: `${size}rem`,
      }}
      initial={{ scale: 0.8, opacity: 0.3 }}
      animate={{ 
        scale: [0.8, 1.2, 0.8], 
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration,
        delay,
        ease: "easeInOut"
      }}
    />
  );

  return (
    <section
      id="tools-section"
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      {/* 背景装饰元素 */}
      {decorations.map((props, index) => (
        <DecorativeElement key={index} {...props} />
      ))}
      
      {/* 背景网格 - 暗色模式下可见 */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
           style={{ 
             backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zm0-20h20v20H20V0zM0 20h20v20H0V20z'/%3E%3C/g%3E%3C/svg%3E\")",
             backgroundSize: "30px 30px"
           }}>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase dark:text-blue-400">功能工具</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            数据分析工具
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            专业的数据分析和AI辅助工具，帮助你从数据中发现洞察，优化决策流程
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
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {toolsData.map((tool) => (
              <motion.div key={tool.id} variants={itemVariants}>
                <Link href={tool.link}>
                  <div className="group h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 relative hover:translate-y-[-8px] cursor-pointer">
                    {/* 卡片顶部装饰光效 */}
                    <div className="absolute -top-24 -right-24 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                    
                    <div
                      className="p-6 flex items-center justify-between"
                      style={{ background: tool.gradient }}
                    >
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg shadow-inner">
                        {tool.icon}
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full py-1 px-3 shadow-inner">
                        <span className="text-white text-sm font-medium">
                          {tool.status} {tool.statusLabel}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                        {tool.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                          开始使用
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                          <Zap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="text-gray-500 dark:text-gray-400 italic">
            基于实际项目经验开发的专业工具，持续优化中
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsSection;