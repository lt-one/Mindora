"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  
  // 打字机效果变量
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "数据分析师 | AI爱好者";
  const typingSpeed = 100; // 打字速度（毫秒/字符）
  
  // 代码编辑器打字机效果
  const [codeLines, setCodeLines] = useState<React.ReactNode[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [codeTypingComplete, setCodeTypingComplete] = useState(false);
  
  // 完整代码行数组 - 使用JSX元素数组
  const fullCodeLines = [
    <p key="1"><span className="text-pink-400">class</span> <span className="text-yellow-300">Mindora</span>:</p>,
    <p key="2" className="ml-4"><span className="text-gray-400">"""探索内心的空间，展示数据分析与AI创新的个人网站"""</span></p>,
    <p key="3" className="ml-4"><span className="text-pink-400">def</span> <span className="text-blue-400">__init__</span>(<span className="text-white">self</span>):</p>,
    <p key="4" className="ml-8"><span className="text-white">self</span>.creator = <span className="text-cyan-300">"刘涛 - 数据分析师 | AI爱好者"</span></p>,
    <p key="5" className="ml-8"><span className="text-white">self</span>.skills = [<span className="text-cyan-300">"Python"</span>, <span className="text-cyan-300">"数据分析"</span>, <span className="text-cyan-300">"舆情监测"</span>, <span className="text-cyan-300">"AI开发"</span>, <span className="text-cyan-300">"大语言模型应用"</span>]</p>,
    <p key="6" className="ml-8"><span className="text-white">self</span>.tech_stack = {'{'}</p>,
    <p key="7" className="ml-12"><span className="text-cyan-300">"前端"</span>: [<span className="text-cyan-300">"Next.js"</span>, <span className="text-cyan-300">"TypeScript"</span>, <span className="text-cyan-300">"Tailwind CSS"</span>],</p>,
    <p key="8" className="ml-12"><span className="text-cyan-300">"后端"</span>: [<span className="text-cyan-300">"Node.js"</span>, <span className="text-cyan-300">"Express"</span>, <span className="text-cyan-300">"Prisma"</span>],</p>,
    <p key="9" className="ml-12"><span className="text-cyan-300">"数据可视化"</span>: [<span className="text-cyan-300">"ECharts"</span>, <span className="text-cyan-300">"D3.js"</span>],</p>,
    <p key="10" className="ml-12"><span className="text-cyan-300">"AI技术"</span>: [<span className="text-cyan-300">"OpenAI API"</span>, <span className="text-cyan-300">"TensorFlow"</span>, <span className="text-cyan-300">"PyTorch"</span>]</p>,
    <p key="11" className="ml-8">{'}'}</p>,
    <p key="12" className="mt-4"></p>,
    <p key="13" className="ml-4"><span className="text-pink-400">def</span> <span className="text-blue-400">get_features</span>(<span className="text-white">self</span>):</p>,
    <p key="14" className="ml-8"><span className="text-cyan-300"># 核心功能列表</span></p>,
    <p key="15" className="ml-8"><span className="text-pink-400">return</span> {'{'}</p>,
    <p key="16" className="ml-12"><span className="text-cyan-300">"博客系统"</span>: <span className="text-yellow-300">BlogSystem</span>(</p>,
    <p key="17" className="ml-16">categories=[<span className="text-cyan-300">"个人成长"</span>, <span className="text-cyan-300">"职业发展"</span>, <span className="text-cyan-300">"技术分享"</span>, <span className="text-cyan-300">"AI工具指南"</span>, <span className="text-cyan-300">"项目复盘"</span>],</p>,
    <p key="18" className="ml-16">update_frequency=<span className="text-cyan-300">"每周1-2篇"</span>,</p>,
    <p key="19" className="ml-16">style=<span className="text-cyan-300">"深度原创内容"</span>,</p>,
    <p key="19.1" className="ml-16">description=<span className="text-cyan-300">"分享真实经历与深度思考，记录从校园到职场的成长之路，以及AI时代的技术探索"</span></p>,
    <p key="19.2" className="ml-12">),</p>,
    <p key="20" className="ml-12"><span className="text-cyan-300">"项目展示"</span>: <span className="text-yellow-300">ProjectGallery</span>(</p>,
    <p key="21" className="ml-16">categories=[<span className="text-cyan-300">"数据分析"</span>, <span className="text-cyan-300">"AI应用"</span>, <span className="text-cyan-300">"产品设计"</span>],</p>,
    <p key="22" className="ml-16">display_mode=<span className="text-cyan-300">"卡片式轮播"</span></p>,
    <p key="23" className="ml-12">),</p>,
    <p key="24" className="ml-12"><span className="text-cyan-300">"数据仪表盘"</span>: <span className="text-yellow-300">DataDashboard</span>(</p>,
    <p key="25" className="ml-16">visualizations=[<span className="text-cyan-300">"舆情分析"</span>, <span className="text-cyan-300">"市场趋势"</span>],</p>,
    <p key="26" className="ml-16">update_mode=<span className="text-cyan-300">"实时动态"</span></p>,
    <p key="27" className="ml-12">),</p>,
    <p key="28" className="ml-12"><span className="text-cyan-300">"Todo应用"</span>: <span className="text-yellow-300">TodoApp</span>(</p>,
    <p key="29" className="ml-16">features=[<span className="text-cyan-300">"拖拽排序"</span>, <span className="text-cyan-300">"分类管理"</span>, <span className="text-cyan-300">"优先级设置"</span>]</p>,
    <p key="30" className="ml-12">),</p>,
    <p key="31" className="ml-12"><span className="text-cyan-300">"好站分享"</span>: <span className="text-yellow-300">GoodSites</span>(</p>,
    <p key="32" className="ml-16">categories=[<span className="text-cyan-300">"开发工具"</span>, <span className="text-cyan-300">"学习平台"</span>, <span className="text-cyan-300">"设计资源"</span>]</p>,
    <p key="33" className="ml-12">),</p>,
    <p key="34" className="ml-12"><span className="text-cyan-300">"AI产品开发"</span>: <span className="text-yellow-300">AIProductDev</span>(</p>,
    <p key="35" className="ml-16">capabilities=[<span className="text-cyan-300">"大模型应用集成"</span>, <span className="text-cyan-300">"智能助手定制"</span>, <span className="text-cyan-300">"提示词工程"</span>],</p>,
    <p key="36" className="ml-16">frameworks=[<span className="text-cyan-300">"Python"</span>, <span className="text-cyan-300">"Next.js"</span>, <span className="text-cyan-300">"Flask"</span>]</p>,
    <p key="37" className="ml-12">),</p>,
    <p key="38" className="ml-8">{'}'}</p>,
  ];
  
  // 代码编辑器打字机效果
  useEffect(() => {
    if (codeTypingComplete) return;
    
    // 简化的打字机效果 - 每隔一定时间显示下一行代码
    const typingInterval = setTimeout(() => {
      if (currentLine < fullCodeLines.length) {
        const newLines = [...codeLines];
        newLines.push(fullCodeLines[currentLine]);
        setCodeLines(newLines);
        setCurrentLine(currentLine + 1);
      } else {
        setCodeTypingComplete(true);
      }
    }, 100); // 每行代码显示间隔时间
    
    return () => clearTimeout(typingInterval);
  }, [currentLine, codeLines, fullCodeLines, codeTypingComplete]);

  useEffect(() => {
    // 进入视图动画
    setIsVisible(true);
    
    // 打字机效果
    if (isTyping) {
      if (text.length < fullText.length) {
        const timeout = setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
        }, typingSpeed);
        
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    }
  }, [text, isTyping, fullText]);

  // 处理下箭头点击事件
  const handleScrollDown = () => {
    // 平滑滚动到下一部分
    const featuredProjectsSection = document.getElementById('featured-projects');
    if (featuredProjectsSection) {
      featuredProjectsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // 如果没有找到特定ID的元素，则滚动到技术栈部分
      nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[110vh] flex items-start -mt-8 pt-0 pb-20 md:pb-32 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 -z-10"></div>
      
      {/* 装饰图形 */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 dark:bg-blue-700 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-700 rounded-full filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-0 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center pt-12">
          {/* 左侧内容 */}
          <div className={`space-y-4 md:space-y-6 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}>
            <p className="text-blue-600 dark:text-blue-400 font-medium text-base md:text-lg flex items-center gap-2">
              你好 <span className="animate-wave inline-block">👋</span>
            </p>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3">
              我是<span className="text-blue-600 dark:text-blue-400 relative">
                刘涛
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-full opacity-30"></span>
              </span>
            </h1>
            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white -mt-1 mb-2">
              <span className="whitespace-nowrap inline-block text-[90%]">{text}<span className={`ml-1 inline-block h-6 md:h-8 w-1 bg-blue-600 dark:bg-blue-400 ${isTyping ? 'animate-blink' : ''}`}></span></span>
            </h2>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg py-1">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 md:p-3 text-center">
                <p className="text-blue-600 dark:text-blue-300 text-lg md:text-xl font-bold">1+</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">年舆情分析</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-2 md:p-3 text-center">
                <p className="text-indigo-600 dark:text-indigo-300 text-lg md:text-xl font-bold">3+</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">数据项目</p>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-lg p-2 md:p-3 text-center">
                <p className="text-cyan-600 dark:text-cyan-300 text-lg md:text-xl font-bold">5+</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">技术栈</p>
              </div>
            </div>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-lg border-l-4 border-blue-500 pl-4">
              专注于<span className="font-medium">舆情数据分析</span>与<span className="font-medium">AI产品开发</span>，精通Python和数据可视化，致力于将复杂数据转化为有价值的洞察与决策支持。
            </p>
            
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-1 md:px-3 md:py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs md:text-sm rounded-full">Python</span>
              <span className="px-2 py-1 md:px-3 md:py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs md:text-sm rounded-full">数据分析</span>
              <span className="px-2 py-1 md:px-3 md:py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs md:text-sm rounded-full">舆情监测</span>
              <span className="px-2 py-1 md:px-3 md:py-1 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 text-xs md:text-sm rounded-full">AI应用</span>
              <span className="px-2 py-1 md:px-3 md:py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs md:text-sm rounded-full">产品开发</span>
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4 pt-3">
              <Link
                href="/projects"
                className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium rounded-lg transition-transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                查看我的项目
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 md:px-6 md:py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base border border-gray-300 dark:border-gray-600 font-medium rounded-lg transition-transform hover:scale-105 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                关于我
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
          </div>
          
          {/* 右侧图像/代码效果 - 更新为网站功能介绍 */}
          <div className={`relative transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } mt-8 lg:mt-0`}>
            <div className="relative bg-gray-900 dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-1">
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 dark:bg-gray-700 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-xs text-gray-400">Mindora_features.py</div>
              </div>
              <div className="pt-7 pb-5 px-5 font-mono text-xs sm:text-sm text-gray-300 dark:text-gray-200 overflow-y-auto h-[280px] sm:h-[320px] md:h-[380px] scrollbar-thin">
                <style jsx>{`
                  .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                  }
                  .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .scrollbar-thin::-webkit-scrollbar-thumb {
                    background-color: rgba(107, 114, 128, 0.3);
                    border-radius: 20px;
                  }
                  .scrollbar-thin {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(107, 114, 128, 0.3) transparent;
                  }
                `}</style>
                
                {codeLines.map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                  </React.Fragment>
                ))}
                
                {!codeTypingComplete && (
                  <span className="inline-block h-3 sm:h-4 w-1 sm:w-2 bg-blue-400 animate-blink ml-1"></span>
                )}
              </div>
            </div>
            
            {/* 装饰元素 */}
            <div className="absolute -bottom-6 -right-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-blue-500 dark:bg-blue-600 rounded-lg rotate-12 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-indigo-500 dark:bg-indigo-600 rounded-lg -rotate-12 -z-10"></div>
          </div>
        </div>
        
        {/* 技术栈和专业领域展示 - 上移到这里 */}
        <div ref={nextSectionRef} className="mt-8 mb-8 pt-4 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-lg md:text-xl font-semibold text-center mb-4 md:mb-6 text-gray-800 dark:text-gray-200">我的专业领域与技术栈</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* 数据分析专长 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-5 md:p-7 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-blue-500 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h4 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">数据分析</h4>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">擅长从复杂数据中提取有价值的洞察，使用Python生态系统进行数据清洗、分析和可视化。</p>
            </div>
            
            {/* 舆情监测专长 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-5 md:p-7 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-purple-500 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <h4 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">舆情监测</h4>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">专注于社交媒体数据挖掘和情感分析，能够实时监控品牌声誉和市场动态。</p>
            </div>
            
            {/* AI产品开发 */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-5 md:p-7 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-amber-500 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a8 8 0 0 1 8 8v12l-4-4-4 4-4-4-4 4V10a8 8 0 0 1 8-8z"></path>
                    <circle cx="12" cy="10" r="2"></circle>
                  </svg>
                </div>
                <h4 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">AI产品开发</h4>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">使用AI技术开发智能产品与解决方案，将大语言模型与业务场景融合，提升产品体验与效率。</p>
            </div>
          </div>
        </div>
        
        {/* 滚动提示 - 添加点击事件 */}
        <div 
          className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={handleScrollDown}
          title="向下滚动"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:h-6 md:w-6 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 