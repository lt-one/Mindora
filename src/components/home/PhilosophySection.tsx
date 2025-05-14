"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon, BrainCircuit, LayersIcon, Compass, FlameIcon } from "lucide-react";

const PhilosophySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('philosophy-section');
      const quoteSection = document.getElementById('quote-section');
      
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
      
      if (quoteSection) {
        const quoteSectionTop = quoteSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (quoteSectionTop < windowHeight * 0.85) {
          setQuoteVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const philosophyItems = [
    {
      title: "数据驱动决策",
      description: "我相信数据的力量，通过深入分析和可视化，将复杂数据转化为清晰洞察，支持决策制定和创新。数据不仅是信息，而是理解世界的透镜。",
      color: "blue",
      icon: <BrainCircuit className="h-8 w-8 text-blue-400 dark:text-blue-300" />,
      delay: 100
    },
    {
      title: "持续学习与创新",
      description: "在快速变化的技术世界中，我坚信终身学习的价值。我热衷于探索新技术，不断拓展自己的知识边界，将创新思维融入工作的各个方面。",
      color: "green",
      icon: <LayersIcon className="h-8 w-8 text-green-400 dark:text-green-300" />,
      delay: 300
    },
    {
      title: "技术赋能生活",
      description: "我致力于通过技术解决实际问题，让技术不仅停留在概念层面，而是能真正改善工作流程、提升效率，创造更大价值。AI和数据科学正在改变世界，我希望成为这个变革的参与者。",
      color: "purple",
      icon: <Compass className="h-8 w-8 text-purple-400 dark:text-purple-300" />,
      delay: 200
    },
    {
      title: "东方智慧与现代科技的融合",
      description: "我受到东方哲学思想的影响，相信平衡与和谐的重要性。在技术开发中，我尝试将东方的思维方式与现代科技相结合，创造既有深度又有人文关怀的产品与解决方案。",
      color: "amber",
      icon: <FlameIcon className="h-8 w-8 text-amber-400 dark:text-amber-300" />,
      delay: 400
    }
  ];

  return (
    <section id="philosophy-section" className="relative py-28 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-tl from-white via-blue-50/50 to-indigo-50/80 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30 -z-10"></div>
      
      {/* 装饰图形 */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-300"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200 dark:bg-indigo-800 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-green-200 dark:bg-green-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      
      {/* 装饰几何图形 */}
      <div className="absolute top-20 right-20 w-40 h-40 border-4 border-blue-200/30 dark:border-blue-600/20 rounded-full"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 border-4 border-purple-200/30 dark:border-purple-600/20 rounded-lg rotate-12"></div>
      <div className="absolute top-40 left-10 w-20 h-20 border-4 border-amber-200/30 dark:border-amber-600/20 transform rotate-45"></div>
      
      {/* 装饰线条 */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 dark:via-blue-400/20 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-indigo-400/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <p className="text-blue-600 dark:text-blue-400 font-medium text-base md:text-lg mb-3">我的价值观</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-50">
            个人<span className="text-blue-600 dark:text-blue-400 relative inline-block">
              理念
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-full opacity-30"></span>
            </span>与使命
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            我追求的核心价值观以及愿景
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          {philosophyItems.map((item, index) => (
            <Card 
              key={index}
              className={`bg-white/90 dark:bg-slate-800/60 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform backdrop-blur-sm overflow-hidden relative group hover:-translate-y-2 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <div className={`absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-${item.color}-400 to-${item.color}-600 dark:from-${item.color}-500 dark:to-${item.color}-700`}></div>
              <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/5 to-${item.color}-600/5 dark:from-${item.color}-500/10 dark:to-${item.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className={`absolute -right-16 -bottom-16 w-48 h-48 bg-${item.color}-100/20 dark:bg-${item.color}-900/20 rounded-full`}></div>
              
              <CardContent className="p-8">
                <div className="flex items-center mb-5">
                  {item.icon}
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 ml-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div 
          id="quote-section" 
          className={`mt-20 text-center relative transform transition-all duration-1000 ${
            quoteVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <QuoteIcon className="h-40 w-40 text-blue-200/30 dark:text-blue-800/20" />
          </div>
          
          <blockquote className="text-xl md:text-2xl italic text-slate-700 dark:text-slate-300 max-w-3xl mx-auto relative z-10">
            "在数据的海洋中寻找真相，用技术的力量创造价值，不断探索与突破自我的边界。"
          </blockquote>
          
          <div className="mt-6 font-medium text-slate-900 dark:text-slate-100 flex items-center justify-center">
            <span className="inline-block h-px w-8 bg-blue-500 dark:bg-blue-400 mr-4"></span>
            我的座右铭
            <span className="inline-block h-px w-8 bg-blue-500 dark:bg-blue-400 ml-4"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection; 