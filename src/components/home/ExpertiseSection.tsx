"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, BarChart, Wrench, Code, Lightbulb, PenTool } from "lucide-react";

const ExpertiseSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('expertise-section');
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="expertise-section" className="relative py-24 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/30 -z-10"></div>
      
      {/* 装饰图形 */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-700 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-indigo-200 dark:bg-indigo-700 rounded-full filter blur-3xl opacity-10 animate-pulse delay-700"></div>
      <div className="absolute top-60 left-0 w-72 h-72 bg-cyan-200 dark:bg-cyan-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <p className="text-blue-600 dark:text-blue-400 font-medium text-base md:text-lg mb-3">我的专业技能</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-50">
            专业<span className="text-blue-600 dark:text-blue-400 relative inline-block">
              领域
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-full opacity-30"></span>
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            专注于舆情数据分析与AI产品开发，将复杂数据转化为有价值的洞察与决策支持
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <Card className={`bg-white/80 dark:bg-slate-800/50 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } hover:-translate-y-2 group backdrop-blur-sm overflow-hidden relative`}
          style={{ transitionDelay: '100ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full"></div>
            <CardHeader className="pb-0">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform duration-500">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-slate-50">数据分析</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-base">
                舆情监测与分析
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 dark:text-slate-300">
                日均处理品牌数据5000+条，负责输出舆情事件汇总3000+份，协助及主导输出产品日报/周报/月报100+份。
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 dark:bg-slate-800/50 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } hover:-translate-y-2 group backdrop-blur-sm overflow-hidden relative`}
          style={{ transitionDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 dark:from-indigo-500/10 dark:to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full"></div>
            <CardHeader className="pb-0">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform duration-500">
                <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-slate-50">编程能力</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-base">
                Python与自动化脚本
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 dark:text-slate-300">
                精通Python、SQL，熟悉Linux环境，开发自动化脚本提升数据处理效率，优化数据统计及分析流程。
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 dark:bg-slate-800/50 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } hover:-translate-y-2 group backdrop-blur-sm overflow-hidden relative`}
          style={{ transitionDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 dark:from-green-500/10 dark:to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-green-500/10 dark:bg-green-500/20 rounded-full"></div>
            <CardHeader className="pb-0">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform duration-500">
                <BarChart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-slate-50">数据可视化</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-base">
                报表设计与展示
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 dark:text-slate-300">
                熟练运用Pandas、Numpy、Tableau和Excel数据透视表进行数据处理与报表制作，设计BI看板优化数据展示。
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 dark:bg-slate-800/50 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } hover:-translate-y-2 group backdrop-blur-sm overflow-hidden relative`}
          style={{ transitionDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 dark:from-purple-500/10 dark:to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/20 rounded-full"></div>
            <CardHeader className="pb-0">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform duration-500">
                <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-slate-50">AI应用</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-base">
                大模型与提示词工程
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 dark:text-slate-300">
                熟悉各类AI大模型的使用，掌握Prompt Engineering技术，设计「数据清洗-观点提取-情感分析」prompt，提升分析效率65%。
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 dark:bg-slate-800/50 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } hover:-translate-y-2 group backdrop-blur-sm overflow-hidden relative`}
          style={{ transitionDelay: '500ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 dark:from-orange-500/10 dark:to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-orange-500/10 dark:bg-orange-500/20 rounded-full"></div>
            <CardHeader className="pb-0">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform duration-500">
                <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-slate-50">流程优化</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-base">
                标准化与自动化
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 dark:text-slate-300">
                建立标准化舆情汇总SOP，优化舆情监测预警流程，将事件汇总统计时间从1小时压缩至30分钟内。
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 dark:bg-slate-800/50 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } hover:-translate-y-2 group backdrop-blur-sm overflow-hidden relative`}
          style={{ transitionDelay: '600ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/5 dark:from-pink-500/10 dark:to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-pink-500/10 dark:bg-pink-500/20 rounded-full"></div>
            <CardHeader className="pb-0">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform duration-500">
                <PenTool className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-slate-50">设计能力</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-base">
                产品与可视化方案
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-slate-600 dark:text-slate-300">
                熟练使用Axure、Xmind、Visio等工具，能够设计低保真原型图、思维导图、流程图等，为产品开发提供清晰的可视化方案。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection; 