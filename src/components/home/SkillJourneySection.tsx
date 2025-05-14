"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Code, BarChart3, RefreshCcw, Trophy, Target, BrainCircuit, 
  BookOpen, Sparkles, Compass, Lightbulb, Database, LineChart, FileSpreadsheet,
  Wrench, GitBranch, Network, Laptop, Zap, Scale, Search, SplitSquareVertical, AlertCircle,
  Star, StarHalf, BookMarked, BookText, BookOpenCheck
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const SkillJourneySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");
  const [skillProgress, setSkillProgress] = useState<Record<string, number>>({});
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toolCategory, setToolCategory] = useState<string>("all");

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('skill-journey-section');
      const skillsSection = document.getElementById('skills-content');
      
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
      
      if (skillsSection) {
        const skillsSectionTop = skillsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (skillsSectionTop < windowHeight * 0.85) {
          setSkillsVisible(true);
          
          // 渐进式显示技能进度条
          const skills = {
            "python": 92,
            "data_analysis": 90,
            "data_visualization": 88,
            "ai": 85,
            "sentiment_analysis": 95,
            "web_development": 75,
            "sql": 82,
            "tableau": 78,
            "product_design": 88,
            "prompting": 94
          };
          
          Object.keys(skills).forEach((skill, index) => {
            setTimeout(() => {
              setSkillProgress(prev => ({
                ...prev,
                [skill]: skills[skill as keyof typeof skills]
              }));
            }, index * 150);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 技能数据
  const technicalSkills = [
    { 
      name: "Python", 
      icon: <Code className="w-5 h-5" />, 
      progress: skillProgress.python || 0,
      color: "bg-blue-500 dark:bg-blue-600",
      description: "数据分析、自动化脚本、爬虫、机器学习"
    },
    { 
      name: "数据分析", 
      icon: <Database className="w-5 h-5" />, 
      progress: skillProgress.data_analysis || 0,
      color: "bg-indigo-500 dark:bg-indigo-600",
      description: "结构化与非结构化数据处理、统计分析、洞察提取"
    },
    { 
      name: "数据可视化", 
      icon: <BarChart3 className="w-5 h-5" />, 
      progress: skillProgress.data_visualization || 0,
      color: "bg-cyan-500 dark:bg-cyan-600",
      description: "交互式仪表盘、数据故事讲述、信息图表设计"
    },
    { 
      name: "AI应用", 
      icon: <BrainCircuit className="w-5 h-5" />, 
      progress: skillProgress.ai || 0,
      color: "bg-purple-500 dark:bg-purple-600",
      description: "大模型应用开发、AI工具集成与定制化部署"
    },
    { 
      name: "舆情分析", 
      icon: <LineChart className="w-5 h-5" />, 
      progress: skillProgress.sentiment_analysis || 0,
      color: "bg-green-500 dark:bg-green-600",
      description: "社交媒体监测、情感分析、趋势预测、品牌声誉管理"
    }
  ];
  
  const toolSkills = [
    { 
      name: "SQL", 
      icon: <Database className="w-5 h-5" />, 
      progress: skillProgress.sql || 0,
      color: "bg-orange-500 dark:bg-orange-600",
      description: "数据查询、分析和管理"
    },
    { 
      name: "Tableau", 
      icon: <BarChart3 className="w-5 h-5" />, 
      progress: skillProgress.tableau || 0,
      color: "bg-blue-500 dark:bg-blue-600",
      description: "创建交互式数据可视化和仪表板"
    },
    { 
      name: "产品设计", 
      icon: <Lightbulb className="w-5 h-5" />, 
      progress: skillProgress.product_design || 0,
      color: "bg-green-500 dark:bg-green-600",
      description: "用户研究、原型设计、用户体验优化"
    },
    { 
      name: "Web开发", 
      icon: <Code className="w-5 h-5" />, 
      progress: skillProgress.web_development || 0,
      color: "bg-indigo-500 dark:bg-indigo-600",
      description: "Next.js、React、Tailwind CSS"
    },
    { 
      name: "Prompt工程", 
      icon: <Sparkles className="w-5 h-5" />, 
      progress: skillProgress.prompting || 0,
      color: "bg-purple-500 dark:bg-purple-600",
      description: "AI提示词优化、对话流设计、场景化应用"
    }
  ];
  
  // 思维工具箱数据
  const thinkingTools = [
    {
      id: "systems-thinking",
      name: "系统思考",
      icon: <Network className="w-7 h-7 text-blue-500" />,
      category: "analysis",
      description: "将问题视为相互关联的系统，关注整体而非部分，识别模式、反馈循环和系统结构。",
      useCase: "复杂问题分析、组织结构设计、生态系统评估",
      method: "绘制系统图表、识别反馈循环、寻找杠杆点",
      example: "分析用户流失问题时，不只关注单一因素，而是构建包含用户体验、竞品、价格等多维度的系统模型，找出关键影响点。",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "first-principles",
      name: "第一性原理",
      icon: <Database className="w-7 h-7 text-indigo-500" />,
      category: "analysis",
      description: "将问题拆解至最基本的真理，从根本出发重新构建解决方案，避免基于假设或类比的思考。",
      useCase: "创新突破、挑战常规思维、根本性解决方案",
      method: "持续发问「为什么」、质疑基础假设、拆解至基本单元",
      example: "重新思考数据分析报告的设计，不是模仿现有模板，而是从「用户决策需求」出发，构建信息展示的最佳结构。",
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "inversion",
      name: "逆向思考",
      icon: <RefreshCcw className="w-7 h-7 text-rose-500" />,
      category: "creative",
      description: "从目标的反面思考，识别需要避免的问题和风险，通过防止失败来实现成功。",
      useCase: "风险管理、避免盲点、发现隐藏问题",
      method: "思考「如何确保失败」、列出最坏情况、识别隐藏问题",
      example: "设计用户研究方案时，不仅思考「如何获取用户需求」，还思考「哪些因素会让研究结果完全无效」，从而优化研究设计。",
      color: "from-rose-500 to-pink-500"
    },
    {
      id: "mental-models",
      name: "多模型思维",
      icon: <SplitSquareVertical className="w-7 h-7 text-amber-500" />,
      category: "creative",
      description: "综合运用多种思维模型，从不同角度理解问题，避免单一视角的局限性。",
      useCase: "复杂决策、全面分析、避免认知偏见",
      method: "应用多个领域的思维工具、交叉验证、多角度评估",
      example: "分析市场机会时，结合经济学的供需模型、心理学的行为洞察、博弈论的竞争分析，得出更全面的结论。",
      color: "from-amber-500 to-yellow-500"
    },
    {
      id: "second-order",
      name: "二阶思维",
      icon: <GitBranch className="w-7 h-7 text-emerald-500" />,
      category: "decision",
      description: "考虑决策的长期和连锁反应，思考「接下来会发生什么」，预测多步决策后果。",
      useCase: "战略规划、风险管理、避免短视决策",
      method: "推演未来多步、考虑系统反馈、预测他人反应",
      example: "评估产品功能时，不仅考虑直接用户反应，还考虑功能如何改变用户行为模式、影响商业模式、触发竞争对手反应等连锁效应。",
      color: "from-emerald-500 to-green-500"
    },
    {
      id: "opportunity-cost",
      name: "机会成本思维",
      icon: <Scale className="w-7 h-7 text-sky-500" />,
      category: "decision",
      description: "评估选择一个选项而放弃其他选项的隐性成本，确保资源的最优配置。",
      useCase: "资源分配、优先级确定、战略取舍",
      method: "列出所有选择、评估放弃选项的价值、权衡隐形成本",
      example: "在决定深入研究一个新技术时，不仅评估该技术的收益，还要考虑同期无法投入其他技术学习的机会损失，作出最优选择。",
      color: "from-sky-500 to-blue-500"
    },
    {
      id: "critical-thinking",
      name: "批判性思维",
      icon: <AlertCircle className="w-7 h-7 text-orange-500" />,
      category: "analysis",
      description: "理性、系统地分析和评估信息，质疑假设，识别认知偏见，形成独立判断。",
      useCase: "评估信息真实性、避免认知偏见、作出理性决策",
      method: "寻找相反证据、识别论证谬误、质疑信息来源",
      example: "分析市场研究报告时，不盲目接受结论，而是深入检视研究方法、样本代表性、可能的利益冲突，形成独立的数据解读。",
      color: "from-orange-500 to-red-500"
    },
    {
      id: "bayes-theorem",
      name: "贝叶斯思维",
      icon: <Zap className="w-7 h-7 text-violet-500" />,
      category: "decision",
      description: "基于新证据不断更新信念概率，平衡先验知识与新信息，处理不确定性。",
      useCase: "风险评估、概率决策、处理不确定信息",
      method: "估算初始概率、评估新证据、数据驱动更新判断",
      example: "评估产品研发方向时，从初始市场判断出发，随着用户反馈、竞品动向等新信息的获取，持续调整成功概率评估和资源投入。",
      color: "from-violet-500 to-purple-500"
    }
  ];

  // 学习旅程与成长数据
  const learningJourney = [
    {
      year: 2024,
      title: "AI产品开发与集成",
      description: "系统学习大模型API调用、提示词工程和AI应用场景设计",
      icon: <BrainCircuit className="w-5 h-5 text-blue-500" />,
      resources: ["OpenAI文档", "吴恩达Prompt Engineering课程", "AI Application开发实践"],
      category: "AI开发",
      categoryColor: "from-blue-500 to-indigo-600",
      achievement: "构建了3个基于大语言模型的智能应用原型"
    },
    {
      year: 2023,
      title: "数据分析与可视化深入学习",
      description: "掌握高级数据清洗技术、统计分析方法和交互式可视化工具",
      icon: <Database className="w-5 h-5 text-indigo-500" />,
      resources: ["Python数据科学手册", "Tableau进阶教程", "数据可视化实战项目"],
      category: "数据科学",
      categoryColor: "from-indigo-500 to-purple-600",
      achievement: "开发了一套数据可视化仪表板，提升数据理解效率40%"
    },
    {
      year: 2022,
      title: "机器学习基础",
      description: "学习监督学习、非监督学习算法以及模型评估方法",
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      resources: ["Machine Learning Coursera课程", "Kaggle竞赛实践", "深度学习入门"],
      category: "人工智能",
      categoryColor: "from-purple-500 to-pink-600",
      achievement: "参与并获得大学生数据分析大赛省级二等奖"
    },
    {
      year: 2020,
      title: "编程基础与数据结构",
      description: "系统学习Python编程、数据结构与算法",
      icon: <Code className="w-5 h-5 text-green-500" />,
      resources: ["Python编程：从入门到实践", "数据结构与算法课程", "LeetCode算法训练"],
      category: "编程基础",
      categoryColor: "from-green-500 to-teal-600",
      achievement: "完成100+算法题，构建了个人项目管理系统"
    }
  ];

  // 阅读雷达数据
  const readingRadar = [
    {
      category: "数据分析",
      books: [
        {
          id: "thinking-data",
          title: "数据思维",
          author: "陈旸",
          coverImage: "/images/placeholders/site-placeholder.jpg",
          rating: 4.5,
          keyInsights: [
            "数据分析的核心是问题定义，而非技术本身",
            "好的数据分析始于好的提问",
            "数据可视化的目的是讲故事而非炫技"
          ],
          summary: "这本书讲述如何培养数据思维，用数据解决实际问题，而不仅仅关注技术层面。",
          recommendReason: "适合想要提升数据分析思维深度的读者，书中案例丰富且实用。",
          readDate: "2023-11"
        },
        {
          id: "storytelling-with-data",
          title: "用数据讲故事",
          author: "Cole Nussbaumer Knaflic",
          coverImage: "/images/placeholders/site-placeholder.jpg",
          rating: 5,
          keyInsights: [
            "有效的数据故事需要明确的受众和目标",
            "删除视觉噪音是数据可视化的关键步骤",
            "选择正确的图表类型取决于你要传达的信息类型"
          ],
          summary: "这本书教你如何通过数据可视化讲述引人入胜的故事，影响决策者的思考。",
          recommendReason: "数据可视化必读之作，特别适合需要向非技术人员展示数据的分析师。",
          readDate: "2023-08"
        }
      ]
    },
    {
      category: "AI与未来",
      books: [
        {
          id: "ai-superpowers",
          title: "AI超级大国",
          author: "李开复",
          coverImage: "/images/placeholders/site-placeholder.jpg",
          rating: 4,
          keyInsights: [
            "AI发展将重塑全球经济和就业格局",
            "中美在AI发展上各有优势与不同路径",
            "AI时代需要重新思考教育和职业发展"
          ],
          summary: "这本书分析了中美在AI领域的竞争态势，以及AI将如何改变未来的工作与生活。",
          recommendReason: "对AI全球格局有独特见解，有助于理解AI革命的社会影响。",
          readDate: "2023-05"
        },
        {
          id: "life-3-0",
          title: "生命3.0",
          author: "Max Tegmark",
          coverImage: "/images/placeholders/site-placeholder.jpg",
          rating: 4.5,
          keyInsights: [
            "AI的发展将经历三个阶段：窄AI、通用AI和超级AI",
            "我们需要在AI获得高度智能前解决AI价值对齐问题",
            "人类需要主动设计AI发展的未来，而非被动接受"
          ],
          summary: "探讨了AI时代人类生命的意义和价值，以及如何引导AI向有益方向发展。",
          recommendReason: "对AI未来发展的哲学和伦理思考，视角宏大且深刻。",
          readDate: "2023-03"
        }
      ]
    },
    {
      category: "个人成长",
      books: [
        {
          id: "atomic-habits",
          title: "原子习惯",
          author: "James Clear",
          coverImage: "/images/placeholders/site-placeholder.jpg",
          rating: 5,
          keyInsights: [
            "微小的改变会带来巨大的效果（1%法则）",
            "习惯养成的四步循环：提示、渴望、反应、奖励",
            "身份认同是习惯改变的核心驱动力"
          ],
          summary: "这本书讲述了如何通过细微的行为改变建立良好的习惯，并持续取得进步。",
          recommendReason: "提供了实用的习惯养成方法，简单易行且有科学依据。",
          readDate: "2022-12"
        },
        {
          id: "deep-work",
          title: "深度工作",
          author: "Cal Newport",
          coverImage: "/images/placeholders/site-placeholder.jpg",
          rating: 4.5,
          keyInsights: [
            "深度工作是当今社会中最稀缺也最有价值的能力",
            "浅层工作虽然忙碌但创造的价值有限",
            "需要刻意安排深度工作时间并减少网络消费"
          ],
          summary: "这本书探讨了在注意力分散的时代，如何培养专注工作的能力，创造更高价值。",
          recommendReason: "对于想要提高工作效率和质量的知识工作者来说非常有价值。",
          readDate: "2022-09"
        }
      ]
    },
    {
      category: "商业思维",
      books: [
        {
          id: "zero-to-one",
          title: "从0到1",
          author: "Peter Thiel",
          coverImage: "/images/placeholders/site-placeholder.jpg",
          rating: 5,
          keyInsights: [
            "真正的创新是从0到1的创造，而非从1到n的复制",
            "创业公司需要追求垄断地位而非完全竞争",
            "未来不是注定的，而是由行动创造的"
          ],
          summary: "这本书分享了对创新创业的深刻见解，强调创造全新事物的重要性。",
          recommendReason: "内容深刻且不落俗套，对创业思维有独特洞察。",
          readDate: "2022-06"
        },
        {
          id: "principles",
          title: "原则",
          author: "Ray Dalio",
          coverImage: "/images/placeholders/site-placeholder.jpg",
          rating: 4,
          keyInsights: [
            "建立原则可以帮助我们做出一致且有效的决策",
            "极度透明和极度求真是组织成功的关键",
            "失败是学习和进步的最佳机会"
          ],
          summary: "桥水基金创始人Ray Dalio分享了他的生活和工作原则，以及如何建立强大的组织文化。",
          recommendReason: "提供了系统化思考和决策的框架，适合想要提升管理能力的读者。",
          readDate: "2022-04"
        }
      ]
    }
  ];

  return (
    <section id="skill-journey-section" className="relative py-28 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30 -z-10"></div>
      
      {/* 装饰图形 */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-indigo-200 dark:bg-indigo-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-[20rem] h-[20rem] bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      
      {/* 装饰几何图形 */}
      <div className="absolute top-20 right-40 w-32 h-32 border-4 border-blue-200/30 dark:border-blue-600/20 rounded-lg rotate-12"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 border-4 border-indigo-200/30 dark:border-indigo-600/20 rounded-full"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <p className="text-blue-600 dark:text-blue-400 font-medium text-base md:text-lg mb-3">我的专业发展</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-50">
            技能<span className="text-blue-600 dark:text-blue-400 relative inline-block">
              成长
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-full opacity-30"></span>
            </span>与旅程
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            探索我的技能发展历程以及未来发展目标
          </p>
        </div>

        <Tabs 
          defaultValue="skills" 
          className="w-full max-w-6xl mx-auto"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-2xl bg-blue-50/50 dark:bg-slate-800/50 p-1 backdrop-blur-sm">
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all duration-300"
              >
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  <span>专业技能</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="thinking" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all duration-300"
              >
                <div className="flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  <span>思维工具箱</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="reading" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all duration-300"
              >
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>阅读雷达</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 技能选项卡内容 */}
          <TabsContent value="skills" id="skills-content" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/90 dark:bg-slate-800/60 border-none shadow-xl backdrop-blur-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50 flex items-center">
                    <Code className="mr-2 text-blue-500" />
                    技术能力
                  </h3>
                  <div className="space-y-6">
                    {technicalSkills.map((skill, index) => (
                      <div 
                        key={index} 
                        className={`transform transition-all duration-1000 ${
                          skillsVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                        }`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                              {skill.icon}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-slate-50">{skill.name}</span>
                          </div>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">{skill.progress}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={skill.progress} className="h-2 bg-slate-200 dark:bg-slate-700" indicatorClassName={skill.color} />
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{skill.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-slate-800/60 border-none shadow-xl backdrop-blur-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50 flex items-center">
                    <Wrench className="mr-2 text-purple-500" />
                    工具掌握
                  </h3>
                  <div className="space-y-6">
                    {toolSkills.map((skill, index) => (
                      <div 
                        key={index} 
                        className={`transform transition-all duration-1000 ${
                          skillsVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                        }`}
                        style={{ transitionDelay: `${(index + 5) * 150}ms` }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                              {skill.icon}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-slate-50">{skill.name}</span>
                          </div>
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">{skill.progress}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={skill.progress} className="h-2 bg-slate-200 dark:bg-slate-700" indicatorClassName={skill.color} />
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{skill.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 思维工具箱选项卡内容 */}
          <TabsContent value="thinking" className="mt-6">
            <div className="space-y-6">
              {/* 分类筛选 */}
              <div className="flex justify-center gap-2 flex-wrap">
                <button 
                  onClick={() => setToolCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    toolCategory === "all" 
                      ? "bg-blue-600 text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  全部工具
                </button>
                <button 
                  onClick={() => setToolCategory("analysis")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    toolCategory === "analysis" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  分析型思维
                </button>
                <button 
                  onClick={() => setToolCategory("creative")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    toolCategory === "creative" 
                      ? "bg-rose-600 text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  创意型思维
                </button>
                <button 
                  onClick={() => setToolCategory("decision")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    toolCategory === "decision" 
                      ? "bg-emerald-600 text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  决策型思维
                </button>
              </div>
              
              {/* 工具展示网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {thinkingTools
                  .filter(tool => toolCategory === "all" || tool.category === toolCategory)
                  .map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative"
                    >
                      <div 
                        className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 
                                  border border-slate-200 dark:border-slate-700 h-full 
                                  ${activeTool === tool.id ? 'ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-blue-500' : ''}
                                  `}
                        onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                      >
                        {/* 顶部渐变条 */}
                        <div className={`h-2 w-full bg-gradient-to-r ${tool.color}`}></div>
                        
                        <div className="p-5">
                          {/* 标题与图标 */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} bg-opacity-10 flex items-center justify-center`}>
                              {tool.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                                {tool.name}
                              </h3>
                              <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded-full ${
                                tool.category === "analysis" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" :
                                tool.category === "creative" ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300" :
                                "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                              }`}>
                                {tool.category === "analysis" ? "分析型" : 
                                 tool.category === "creative" ? "创意型" : "决策型"}
                              </span>
                            </div>
                          </div>
                          
                          {/* 简介 */}
                          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                            {tool.description}
                          </p>
                          
                          {/* 折叠内容 */}
                          {activeTool === tool.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                              className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3"
                            >
                              {/* 适用场景 */}
                              <div>
                                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">适用场景</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{tool.useCase}</p>
                              </div>
                              
                              {/* 使用方法 */}
                              <div>
                                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">使用方法</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{tool.method}</p>
                              </div>
                              
                              {/* 实例 */}
                              <div>
                                <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">应用示例</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{tool.example}</p>
                              </div>
                            </motion.div>
                          )}
                          
                          {/* 展开/收起按钮 */}
                          <button 
                            className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 
                                      text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors
                                      flex items-center gap-1.5`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTool(activeTool === tool.id ? null : tool.id);
                            }}
                          >
                            {activeTool === tool.id ? (
                              <>收起详情 <span className="text-xs">↑</span></>
                            ) : (
                              <>查看详情 <span className="text-xs">↓</span></>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* 阅读雷达选项卡内容 */}
          <TabsContent value="reading" className="mt-6">
            <div className="space-y-8">
              {/* 阅读概览 */}
              <div className="bg-white/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md p-5 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center">
                  <BookOpenCheck className="mr-2 text-blue-500" />
                  阅读概览
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">8+</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">年度阅读</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">4</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">核心领域</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">12+</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">精选推荐</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">30+</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">关键洞察</p>
                  </div>
                </div>
              </div>

              {/* 分类Tabs */}
              <Tabs defaultValue={readingRadar[0].category} className="w-full">
                <div className="flex justify-center mb-6">
                  <TabsList className="bg-slate-100 dark:bg-slate-800/50">
                    {readingRadar.map(category => (
                      <TabsTrigger 
                        key={category.category} 
                        value={category.category}
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                      >
                        {category.category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* 每个分类的书籍 */}
                {readingRadar.map(category => (
                  <TabsContent key={category.category} value={category.category} className="animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.books.map(book => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group border-slate-200 dark:border-slate-700">
                            <CardContent className="p-0 flex flex-col h-full">
                              <div className="flex items-start p-5 pb-3">
                                <div className="w-16 h-20 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden flex-shrink-0 mr-4 shadow-sm">
                                  <Image 
                                    src="/images/blog/wallhaven-852q62_1920x1080.png"
                                    alt={book.title}
                                    width={64}
                                    height={80}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {book.title}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{book.author}</p>
                                  <div className="flex items-center">
                                    {Array.from({ length: Math.floor(book.rating) }).map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    ))}
                                    {book.rating % 1 !== 0 && (
                                      <StarHalf className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    )}
                                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                                      {book.rating.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                                {book.readDate && (
                                  <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                    {book.readDate}
                                  </div>
                                )}
                              </div>
                              
                              <div className="px-5 pb-3 flex-1">
                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                                  "{book.recommendReason}"
                                </p>
                              </div>
                              
                              <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 bg-slate-50/50 dark:bg-slate-800/30">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                  关键洞察
                                </p>
                                <ul className="space-y-1.5">
                                  {book.keyInsights.slice(0, 2).map((insight, i) => (
                                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start">
                                      <span className="text-blue-500 mr-1.5 mt-0.5">•</span>
                                      <span>{insight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SkillJourneySection;

// 添加一些CSS动画
const animationStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`; 