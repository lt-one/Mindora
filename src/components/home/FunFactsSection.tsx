"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Code, Coffee, Laptop, Music, Mountain } from "lucide-react";

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
      title: "AI爱好者",
      description: "日常经常探索各种AI工具和大模型应用，尤其擅长利用AI辅助编程和数据分析。",
      color: "indigo",
      delay: 100
    },
    {
      id: 2,
      icon: <Coffee className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "咖啡成瘾",
      description: "工作和学习离不开一杯美式咖啡，已经尝试过30+种不同的咖啡豆。",
      color: "amber",
      delay: 200
    },
    {
      id: 3,
      icon: <BookOpen className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
      title: "阅读爱好",
      description: "每年阅读20+本书，尤其喜欢技术书籍和东方哲学相关的内容。",
      color: "blue",
      delay: 300
    },
    {
      id: 4,
      icon: <Laptop className="h-6 w-6 text-green-500 dark:text-green-400" />,
      title: "技术探索",
      description: "喜欢探索新技术，自学了Python、React和数据可视化，工作之余会做一些技术实验。",
      color: "green",
      delay: 400
    },
    {
      id: 5,
      icon: <Music className="h-6 w-6 text-purple-500 dark:text-purple-400" />,
      title: "音乐爱好",
      description: "编程时喜欢听轻音乐，钢琴曲和爵士乐是最常听的类型。",
      color: "purple",
      delay: 500
    },
    {
      id: 6,
      icon: <Mountain className="h-6 w-6 text-cyan-500 dark:text-cyan-400" />,
      title: "户外活动",
      description: "周末喜欢短途徒步和摄影，拍摄城市和自然风景。",
      color: "cyan",
      delay: 600
    },
  ];

  const stats = [
    { value: "5000+", label: "每日数据处理量", color: "blue", delay: 200 },
    { value: "100+", label: "产品分析报告", color: "indigo", delay: 400 },
    { value: "65%", label: "工作效率提升", color: "green", delay: 600 },
    { value: "20+", label: "年阅读量", color: "purple", delay: 800 }
  ];

  return (
    <section id="funfacts-section" className="relative py-24 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950/30 -z-10"></div>
      
      {/* 装饰图形 */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200 dark:bg-amber-800 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      
      {/* 装饰多边形 */}
      <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/10 dark:bg-cyan-600/10 rounded-lg rotate-45"></div>
      <div className="absolute bottom-60 left-10 w-16 h-16 bg-amber-400/10 dark:bg-amber-600/10 rounded-lg -rotate-12"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <p className="text-blue-600 dark:text-blue-400 font-medium text-base md:text-lg mb-3">认识更多的我</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-50">
            趣味<span className="text-blue-600 dark:text-blue-400 relative inline-block">
              事实
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-full opacity-30"></span>
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            了解我工作之外的一些兴趣爱好
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {funFacts.map((fact) => (
            <Card 
              key={fact.id} 
              className={`bg-white/80 dark:bg-slate-800/50 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group backdrop-blur-sm overflow-hidden relative ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${fact.delay}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${fact.color}-500/5 to-${fact.color}-600/5 dark:from-${fact.color}-500/10 dark:to-${fact.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className={`absolute -bottom-16 -right-16 w-48 h-48 bg-${fact.color}-500/5 dark:bg-${fact.color}-500/10 rounded-full opacity-30`}></div>
              
              <CardContent className="p-7">
                <div className="flex items-center mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-${fact.color}-100 dark:bg-${fact.color}-900/30 flex items-center justify-center mr-4 transform group-hover:rotate-6 transition-transform duration-500 shadow-sm`}>
                    {fact.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{fact.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{fact.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 趣味数据统计 - 带动画效果 */}
        <div id="stats-section" className="mt-20 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 dark:via-blue-400/20 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-5">
            <div className="text-9xl font-black text-blue-600 dark:text-blue-400 transform -rotate-12 select-none">DATA</div>
          </div>
          
          <div className="mt-12 mb-6 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">数据亮点</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-700 ${
                  statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0" 
                }`}
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-${stat.color}-600/5 dark:from-${stat.color}-500/10 dark:to-${stat.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="p-8 text-center relative z-10">
                  <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-700 dark:from-${stat.color}-400 dark:to-${stat.color}-600 bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base font-medium">{stat.label}</p>
                </div>
                
                <div className="absolute -bottom-2 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 dark:via-blue-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FunFactsSection; 