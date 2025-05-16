"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon, BookOpen, Rocket } from "lucide-react";

// 定义颜色类型
type ColorTheme = 'blue' | 'purple' | 'indigo';

interface JourneyStep {
  title: string;
  description: string;
  phase: string;
  color: ColorTheme;
  icon: React.ReactNode;
  quote: string;
}

const PhilosophySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  // 添加颜色映射
  const colorMap = {
    blue: {
      border: 'border-blue-400 dark:border-blue-500',
      borderLight: 'border-blue-200/40 dark:border-blue-700/30',
      ring: 'ring-blue-500 dark:ring-blue-400',
    },
    purple: {
      border: 'border-purple-400 dark:border-purple-500',
      borderLight: 'border-purple-200/40 dark:border-purple-700/30',
      ring: 'ring-purple-500 dark:ring-purple-400',
    },
    indigo: {
      border: 'border-indigo-400 dark:border-indigo-500',
      borderLight: 'border-indigo-200/40 dark:border-indigo-700/30',
      ring: 'ring-indigo-500 dark:ring-indigo-400',
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('philosophy-section');
      
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.8) { // 调整触发阈值
          setIsVisible(true);
        }
      }
    };

    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % journeySteps.length);
    }, 5000); // 增加轮播时间

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const journeySteps: JourneyStep[] = [
    {
      title: "探索",
      description: "技术之旅始于对数据世界的好奇，驱使我探索数据背后的规律与价值。从编程基础到数据分析，持续学习成为我的核心理念。",
      phase: "起点",
      color: "blue",
      icon: <BookOpen className="h-7 w-7 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />,
      quote: "「好奇心是最好的老师」"
    },
    {
      title: "突破",
      description: "面对技术挑战，学会突破舒适区，用创新思维解决问题。通过融合东西方思维，创造出更具人文关怀的技术解决方案。",
      phase: "过程",
      color: "purple",
      icon: (
        <svg 
          viewBox="0 0 1024 1024" 
          className="h-7 w-7 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" 
          fill="currentColor"
        >
          <path d="M894.184 409.654l0.216 0.4c-0.098-0.17-9.928-17-24.942-20.4-13.288-3-28.836 5.5-39.538 13.166l-42.256-58.454c41.54-29.756 76.44-29.702 98.4-24.418 46.526 11.2 69.258 52.096 71.694 56.722z m-158.2-186.25l91.416-91.43 50.6 50.6L786.57 274zM715.956 758.6a319.646 319.646 0 0 1-268 90.846L274.86 953.896l-0.436-0.436a128.146 128.146 0 0 1-173.646-6.768l-25.462-25.464a128.144 128.144 0 0 1-6.768-173.646l-0.436-0.436L172.564 574.05a319.644 319.644 0 0 1 90.846-268c124.766-124.768 327.78-124.768 452.548 0s124.766 327.776-0.002 452.55zM126.228 870.316l25.456 25.456a56.08 56.08 0 0 0 71.48 6.426L119.8 798.836a56.08 56.08 0 0 0 6.428 71.48zM158.88 736.09l127.03 127.03 67.99-41.028a320.156 320.156 0 0 1-154-154z m506.164-379.134a248 248 0 1 0 0 350.726 248.28 248.28 0 0 0 0-350.726zM478.812 682.67l-48.708-48.708 44.37-88.472-90.426 42.416-48.702-48.706 93.114-188.906 64.898 31.44-47.29 97.466 98.618-44.6 42.928 42.928-46.8 96.426 100.562-45.48 29.67 65.726z m129.012-499.488c6.6-11.432 13.558-27.778 9.2-40.718-4.914-14.622-22.768-22.732-22.948-22.812l0.424 0.174 26.644-66.654c4.878 1.964 48.128 20.52 64.02 65.762 7.502 21.356 11.066 56.128-14.554 100.502zM132 324a52 52 0 1 1 52-52 52 52 0 0 1-52 52z m708 382a52 52 0 1 1-52 52 52 52 0 0 1 52-52z" />
        </svg>
      ),
      quote: "「融合之处，创新涌现」"
    },
    {
      title: "创造",
      description: "技术的终极目标是创造价值。将AI与数据技术应用到实际问题中，通过数据赋能决策，用技术改善生活，持续探索与创新。",
      phase: "未来",
      color: "indigo",
      icon: <Rocket className="h-7 w-7 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />,
      quote: "「价值源于解决真实问题」"
    }
  ];

  return (
    <section id="philosophy-section" className="relative py-20 overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/10 dark:to-indigo-950/20 -z-10"></div>
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-repeat opacity-5 dark:opacity-[0.02] pointer-events-none -z-[5]"></div>
      
      {/* 装饰图形 - 简化 */}
      <div className="absolute top-[-5rem] right-[-5rem] w-72 h-72 bg-blue-200/50 dark:bg-blue-800/30 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-5rem] left-[-5rem] w-60 h-60 bg-indigo-200/50 dark:bg-indigo-800/30 rounded-full filter blur-3xl opacity-40 animate-pulse delay-500"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-12 transform transition-all ease-in-out duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">我的成长旅程</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            技术与<span className="text-blue-500 dark:text-blue-400 relative inline-block whitespace-nowrap">
              价值
              <span className="absolute bottom-[-0.2rem] left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-70"></span>
            </span>的故事
          </h2>
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journeySteps.map((step, index) => (
              <Card 
                key={index}
                className={`rounded-xl bg-white/80 dark:bg-slate-800/70 border ${
                  index === activeCard 
                    ? colorMap[step.color].border 
                    : colorMap[step.color].borderLight
                } shadow-lg hover:shadow-xl transition-all duration-300 transform backdrop-blur-md overflow-hidden relative group hover:-translate-y-1.5 ${
                  index === activeCard ? 
                  `ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ${colorMap[step.color].ring} scale-[1.03] shadow-2xl` : 
                  'shadow-lg'
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100 + 100}ms` }}
                onClick={() => setActiveCard(index)}
                onMouseEnter={() => setActiveCard(index)}
              >
                {/* 卡片顶部动态条 */}
                <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-${step.color}-400 to-${step.color}-500 dark:from-${step.color}-500 dark:to-${step.color}-600 transition-all duration-500 ease-out ${
                  index === activeCard ? 'scale-x-100' : 'scale-x-0'
                }`} style={{ transformOrigin: 'left' }}></div>
                
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-lg bg-${step.color}-100 dark:bg-${step.color}-900/40 flex items-center justify-center mr-4 shadow-md`}>
                      {step.icon} 
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors ${index === activeCard ? `text-${step.color}-600 dark:text-${step.color}-400` : ''}`}>{step.title}</h3>
                      <span className={`text-xs font-semibold text-${step.color}-500 dark:text-${step.color}-400 uppercase tracking-wider`}>{step.phase}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 h-24 line-clamp-4 overflow-hidden">
                    {step.description}
                  </p>
                  
                  <div className={`mt-auto pt-3 border-t border-slate-200/60 dark:border-slate-700/40 text-xs italic text-${step.color}-600 dark:text-${step.color}-400`}>
                    {step.quote}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className={`mt-16 text-center relative transform transition-all ease-in-out duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <QuoteIcon className="h-24 w-24 text-blue-300 dark:text-blue-700" />
            </div>
            
            <blockquote className="text-lg md:text-xl font-medium italic text-slate-700 dark:text-slate-300 max-w-2xl mx-auto relative z-10">
              "每一段技术之旅都是自我发现与价值创造的过程，永远好奇，不断探索，持续创新。"
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection; 