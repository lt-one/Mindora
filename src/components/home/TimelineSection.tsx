"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap, Award } from "lucide-react";

const TimelineSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('timeline-section');
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

  const timelineItems = [
    {
      id: 1,
      type: "work",
      date: "2024.7 - 2025.3",
      title: "广东数源智汇科技有限公司",
      subtitle: "华为终端监测分析组 数据分析师",
      description: "负责监测全网华为品牌相关信息，舆情分析与预警，输出产品日报/周报/月报，为客户提供舆论分析。",
      icon: <Briefcase className="h-5 w-5 text-white" />,
      color: "blue"
    },
    {
      id: 2,
      type: "education",
      date: "2020.09 - 2024.06",
      title: "广东技术师范大学",
      subtitle: "智能科学与技术（本科）",
      description: "主修课程：计算机网络、数据结构、自然语言处理、机器学习、深度学习、大数据、数据挖掘等。",
      icon: <GraduationCap className="h-5 w-5 text-white" />,
      color: "green"
    },
    {
      id: 3,
      type: "work",
      date: "2020.11 - 2021.09",
      title: "科技站宣传部",
      subtitle: "干事",
      description: "统筹运营院级新媒体公众号，主导策划15+场科技赛事宣传，原创产出科技赛事推文32篇，管理4人学生团队。",
      icon: <Award className="h-5 w-5 text-white" />,
      color: "purple"
    },
  ];

  return (
    <section id="timeline-section" className="relative py-24 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white to-indigo-50 dark:from-slate-950 dark:to-indigo-950/30 -z-10"></div>
      
      {/* 装饰图形 */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-300"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-indigo-200 dark:bg-indigo-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-700"></div>
      
      {/* 装饰线条 */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 dark:via-blue-600/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <p className="text-blue-600 dark:text-blue-400 font-medium text-base md:text-lg mb-3">我的成长轨迹</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-50">
            个人<span className="text-blue-600 dark:text-blue-400 relative inline-block">
              旅程
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-full opacity-30"></span>
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            从校园到职场，不断学习与成长的历程
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* 时间线中间线 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-indigo-300 dark:from-blue-900 dark:via-blue-700 dark:to-indigo-800 opacity-50 rounded-full"></div>

            {/* 时间线项目 */}
            {timelineItems.map((item, index) => (
              <div 
                key={item.id} 
                className="relative mb-20 last:mb-0"
                style={{ 
                  opacity: isVisible ? 1 : 0, 
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.8s ease ${index * 0.2}s` 
                }}
              >
                <div className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  {/* 左侧内容或右侧内容 */}
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-16 text-right" : "pl-16"}`}>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 inline-block border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1">
                      {item.date}
                    </div>
                    <Card className="bg-white/80 dark:bg-slate-800/60 border-none shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm overflow-hidden group hover:-translate-y-1">
                      <div className={`absolute top-0 left-0 w-1 h-full bg-${item.color}-500 dark:bg-${item.color}-600`}></div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 font-medium mb-3">{item.subtitle}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 中间图标 */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${
                      item.type === "work" 
                        ? "from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800" 
                        : "from-green-400 to-green-600 dark:from-green-600 dark:to-green-800"
                    } shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      {item.icon}
                      
                      {/* 脉冲效果 */}
                      <span className="absolute w-full h-full rounded-full bg-current opacity-30 animate-ping"></span>
                    </div>
                  </div>

                  {/* 右侧内容或左侧内容（空白） */}
                  <div className="w-1/2"></div>
                </div>
                
                {/* 连接线 */}
                <div className={`absolute top-8 ${index % 2 === 0 ? "left-1/2 right-[calc(50%+32px)]" : "right-1/2 left-[calc(50%+32px)]"} h-0.5 bg-gradient-to-r ${
                  index % 2 === 0 
                    ? "from-transparent to-blue-300 dark:to-blue-700" 
                    : "from-blue-300 dark:from-blue-700 to-transparent"
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection; 