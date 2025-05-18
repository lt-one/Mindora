"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen, Code, Coffee, Laptop, Music, Mountain, RotateCw, Search, Lightbulb, Share2 } from "lucide-react";
import { MotionDiv, MotionH3, MotionP, MotionSpan } from "@/components/motion";

const FunFactsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('funfacts-section');
      const statsSection = document.getElementById('stats-section');
      
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
      
      if (statsSection) {
        const statsSectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (statsSectionTop < windowHeight * 0.85) {
          setStatsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const funFacts = [
    {
      id: 1,
      icon: <Code className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />,
      title: "习惯用类比来理解新事物",
      description: "学习新技术时，喜欢将其与已知概念进行类比，加快理解和掌握速度。",
      color: "indigo",
      tag: "学习方法",
      delay: 100
    },
    {
      id: 2,
      icon: <Coffee className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "喜欢在安静的环境中深度思考",
      description: "戴上降噪耳机，沉浸在自己的世界里解决复杂问题，提高专注力和创造力。",
      color: "amber",
      tag: "工作环境",
      delay: 200
    },
    {
      id: 3,
      icon: <BookOpen className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
      title: "坚信'少即是多'的设计哲学",
      description: "无论是代码还是设计，都追求简洁和优雅，将复杂问题简单化。",
      color: "blue",
      tag: "设计理念",
      delay: 300
    },
    {
      id: 4,
      icon: <Laptop className="h-6 w-6 text-green-500 dark:text-green-400" />,
      title: "会定期整理数字笔记和学习资料",
      description: "保持知识库的有序，方便回顾和查找，构建个人知识体系。",
      color: "green",
      tag: "知识管理",
      delay: 400
    },
    {
      id: 5,
      icon: <Music className="h-6 w-6 text-purple-500 dark:text-purple-400" />,
      title: "认为不同领域的知识可以相互启发",
      description: "经常阅读跨领域的内容，从艺术、历史或心理学中寻找解决技术问题的新思路。",
      color: "purple",
      tag: "思维方式",
      delay: 500
    },
    {
      id: 6,
      icon: <Mountain className="h-6 w-6 text-cyan-500 dark:text-cyan-400" />,
      title: "清晨的阳光是最好的闹钟",
      description: "保持早起的习惯，利用早晨的清醒时间思考和规划，提高一天的工作效率。",
      color: "cyan",
      tag: "生活习惯",
      delay: 600
    },
  ];

  const workPhilosophies = [
    { 
      id: 1,
      value: "持续迭代", 
      label: "臻于完善", 
      color: "blue", 
      delay: 200,
      icon: <RotateCw className="h-6 w-6" />,
      description: "不断完善和改进工作，追求卓越，每一次迭代都是走向完美的一步。"
    },
    { 
      id: 2,
      value: "探索未知", 
      label: "乐在其中", 
      color: "indigo", 
      delay: 400,
      icon: <Search className="h-6 w-6" />,
      description: "勇于尝试新技术和方法，享受探索未知领域的过程，从中获取新知识和灵感。"
    },
    { 
      id: 3,
      value: "化繁为简", 
      label: "洞察本质", 
      color: "green", 
      delay: 600,
      icon: <Lightbulb className="h-6 w-6" />,
      description: "透过复杂表象看清本质，用简洁直观的方式表达和解决问题，让复杂变得简单。"
    },
    { 
      id: 4,
      value: "分享交流", 
      label: "共同成长", 
      color: "purple", 
      delay: 800,
      icon: <Share2 className="h-6 w-6" />,
      description: "乐于分享知识和经验，相信开放的交流可以促进相互学习，实现共同进步。"
    }
  ];

  // 定义动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.03, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }
    }
  };
  
  const workPhilosophyCardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -8,
      boxShadow: "0 30px 40px -15px rgba(0, 0, 0, 0.2), 0 20px 20px -15px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };
  
  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    },
    hover: { 
      rotate: [0, 10, -10, 5, -5, 0],
      transition: { 
        duration: 0.5, 
        ease: "easeInOut" 
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
    hover: { scale: 1.05 }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    show: { scaleX: 0 },
    hover: { 
      scaleX: 1,
      transition: { duration: 0.4 }
    }
  };
  
  const glowVariants = {
    hidden: { opacity: 0.2, scale: 0.8 },
    show: { opacity: 0.3, scale: 1 },
    hover: { 
      opacity: 0.5, 
      scale: 1.4,
      transition: { 
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 2 
      }
    }
  };

  return (
    <section id="funfacts-section" className="relative py-24 overflow-hidden">
      {/* 背景设计 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950/30 -z-10"></div>
      
      {/* 抽象背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-900/10 dark:to-purple-900/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-gradient-to-br from-amber-200/20 to-red-200/20 dark:from-amber-900/10 dark:to-red-900/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-indigo-200/5 to-cyan-200/5 dark:from-indigo-900/5 dark:to-cyan-900/5 blur-3xl"></div>
      </div>
      
      {/* 几何装饰 */}
      <div className="absolute top-20 right-[20%] w-16 h-16 border border-indigo-200/30 dark:border-indigo-700/30 rounded-lg rotate-12"></div>
      <div className="absolute bottom-40 left-[15%] w-20 h-20 border border-amber-200/30 dark:border-amber-700/30 rounded-full"></div>
      <div className="absolute top-1/3 left-[5%] w-12 h-12 border border-green-200/30 dark:border-green-700/30 rotate-45"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <p className="text-blue-600 dark:text-blue-400 font-medium text-base md:text-lg mb-3">认识更多的我</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-50">
            日常<span className="text-blue-600 dark:text-blue-400 relative inline-block">
              习惯
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-full opacity-30"></span>
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            了解我工作之中的一些小习惯与思考方式
          </p>
        </div>

        {/* 日常习惯卡片 - 抽象设计 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {funFacts.map((fact, index) => (
            <MotionDiv
              key={fact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: fact.delay / 1000 }}
              className="group"
            >
              <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-900/90 dark:to-slate-800/70 backdrop-blur-sm shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/70 dark:hover:border-slate-600/70 transition-all duration-300">
                {/* 装饰形状 */}
                <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${
                  fact.color === 'indigo' ? 'bg-indigo-100/50 dark:bg-indigo-900/20' : 
                  fact.color === 'amber' ? 'bg-amber-100/50 dark:bg-amber-900/20' :
                  fact.color === 'blue' ? 'bg-blue-100/50 dark:bg-blue-900/20' :
                  fact.color === 'green' ? 'bg-green-100/50 dark:bg-green-900/20' :
                  fact.color === 'purple' ? 'bg-purple-100/50 dark:bg-purple-900/20' :
                  fact.color === 'cyan' ? 'bg-cyan-100/50 dark:bg-cyan-900/20' :
                  'bg-slate-100/50 dark:bg-slate-900/20'
                } blur-xl transition-all duration-500 group-hover:scale-125`}></div>
                <div className={`absolute right-4 top-4 w-2 h-2 rounded-full ${
                  fact.color === 'indigo' ? 'bg-indigo-400 dark:bg-indigo-500' : 
                  fact.color === 'amber' ? 'bg-amber-400 dark:bg-amber-500' :
                  fact.color === 'blue' ? 'bg-blue-400 dark:bg-blue-500' :
                  fact.color === 'green' ? 'bg-green-400 dark:bg-green-500' :
                  fact.color === 'purple' ? 'bg-purple-400 dark:bg-purple-500' :
                  fact.color === 'cyan' ? 'bg-cyan-400 dark:bg-cyan-500' :
                  'bg-slate-400 dark:bg-slate-500'
                } transition-all duration-500 group-hover:scale-150`}></div>
                
                <div className="p-7 relative z-10 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${
                      fact.color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-900/30' : 
                      fact.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/30' :
                      fact.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30' :
                      fact.color === 'green' ? 'bg-green-50 dark:bg-green-900/30' :
                      fact.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/30' :
                      fact.color === 'cyan' ? 'bg-cyan-50 dark:bg-cyan-900/30' :
                      'bg-slate-50 dark:bg-slate-900/30'
                    } flex items-center justify-center shadow-sm`}>
                      {fact.icon}
                    </div>
                    <span className={`text-xs font-medium ${
                      fact.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 
                      fact.color === 'amber' ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' :
                      fact.color === 'blue' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                      fact.color === 'green' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' :
                      fact.color === 'purple' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' :
                      fact.color === 'cyan' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' :
                      'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20'
                    } px-2 py-1 rounded-full`}>
                      {fact.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">{fact.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-auto">{fact.description}</p>
                  
                  {/* 装饰线 */}
                  <div className={`absolute bottom-0 left-0 h-1 ${
                    fact.color === 'indigo' ? 'bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-indigo-500 dark:to-indigo-700' : 
                    fact.color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700' :
                    fact.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700' :
                    fact.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700' :
                    fact.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700' :
                    fact.color === 'cyan' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-700' :
                    'bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700'
                  } w-0 group-hover:w-full transition-all duration-500`}></div>
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>

        {/* 工作理念部分 - 抽象设计 */}
        <div id="stats-section" className="mt-32 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 dark:via-blue-400/20 to-transparent"></div>
          
          <div className="mt-12 mb-14 text-center">
            <MotionH3 
              initial={{ opacity: 0, y: -20 }}
              animate={statsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4"
            >
              工作理念
            </MotionH3>
            <MotionP 
              initial={{ opacity: 0 }}
              animate={statsVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base"
            >
              指引我日常工作和持续成长的核心原则
            </MotionP>
          </div>
          
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            animate={statsVisible ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {workPhilosophies.map((philosophy) => (
              <MotionDiv
                key={philosophy.id}
                variants={workPhilosophyCardVariants}
                whileHover="hover"
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800/80 dark:backdrop-blur-md p-6 h-full shadow-lg border border-slate-200/50 dark:border-slate-700/60 hover:dark:border-slate-500/70 hover:shadow-xl transition-all duration-300">
                  {/* 抽象背景 */}
                  <MotionDiv
                    variants={glowVariants}
                    className={`absolute -right-24 -bottom-24 w-48 h-48 rounded-full ${
                      philosophy.color === 'blue' ? 'bg-blue-100/30 dark:bg-blue-900/20' :
                      philosophy.color === 'indigo' ? 'bg-indigo-100/30 dark:bg-indigo-900/20' :
                      philosophy.color === 'green' ? 'bg-green-100/30 dark:bg-green-900/20' :
                      philosophy.color === 'purple' ? 'bg-purple-100/30 dark:bg-purple-900/20' :
                      'bg-slate-100/30 dark:bg-slate-900/20'
                    } blur-3xl`}
                  ></MotionDiv>
                  
                  <div className="relative text-center mb-4">
                    <MotionDiv
                      variants={iconVariants}
                      whileHover="hover"
                      className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full ${
                        philosophy.color === 'blue' ? 'bg-blue-50 dark:bg-blue-700/40' :
                        philosophy.color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-700/40' :
                        philosophy.color === 'green' ? 'bg-green-50 dark:bg-green-700/40' :
                        philosophy.color === 'purple' ? 'bg-purple-50 dark:bg-purple-700/40' :
                        'bg-slate-50 dark:bg-slate-700/40'
                      } shadow-sm`}
                    >
                      <div className={`${
                        philosophy.color === 'blue' ? 'text-blue-500 dark:text-blue-400' :
                        philosophy.color === 'indigo' ? 'text-indigo-500 dark:text-indigo-400' :
                        philosophy.color === 'green' ? 'text-green-500 dark:text-green-400' :
                        philosophy.color === 'purple' ? 'text-purple-500 dark:text-purple-400' :
                        'text-slate-500 dark:text-slate-400'
                      }`}>
                        {philosophy.icon}
                      </div>
                    </MotionDiv>
                  </div>
                  
                  <div className="relative text-center z-10">
                    <MotionH3
                      variants={textVariants}
                      className={`text-3xl font-bold mb-2 ${
                        philosophy.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600' :
                        philosophy.color === 'indigo' ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-600' :
                        philosophy.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-700 dark:from-green-400 dark:to-green-600' :
                        philosophy.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600' :
                        'bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-400 dark:to-slate-600'
                      } bg-clip-text text-transparent`}
                    >{philosophy.value}</MotionH3>
                    <MotionP 
                      variants={textVariants}
                      className="text-slate-700 dark:text-slate-200 font-medium"
                    >{philosophy.label}</MotionP>
                    
                    {/* 渐变显示描述 */}
                    <MotionDiv
                      initial={{ opacity: 0, height: 0 }}
                      whileHover={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }}
                      className="mt-4 overflow-hidden"
                    >
                      <MotionP 
                        variants={textVariants}
                        className={`text-sm ${
                          philosophy.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                          philosophy.color === 'indigo' ? 'text-indigo-700 dark:text-indigo-300' :
                          philosophy.color === 'green' ? 'text-green-700 dark:text-green-300' :
                          philosophy.color === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                          'text-slate-700 dark:text-slate-300'
                        }`}
                      >{philosophy.description}</MotionP>
                    </MotionDiv>
                  </div>
                  
                  {/* 互动装饰线 */}
                  <MotionDiv
                    variants={lineVariants}
                    className={`absolute inset-x-0 bottom-0 h-1 ${
                      philosophy.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700' :
                      philosophy.color === 'indigo' ? 'bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-indigo-500 dark:to-indigo-700' :
                      philosophy.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700' :
                      philosophy.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700' :
                      'bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700'
                    }`}
                  ></MotionDiv>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default FunFactsSection; 