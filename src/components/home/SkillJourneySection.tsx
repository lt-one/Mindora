"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Code, BarChart3, RefreshCcw, Trophy, Target, BrainCircuit, 
  BookOpen, Sparkles, Compass, Lightbulb, Database, LineChart, FileSpreadsheet,
  Wrench, GitBranch, Network, Laptop, Zap, Scale, Search, SplitSquareVertical, AlertCircle,
  Star, StarHalf, BookMarked, BookText, BookOpenCheck, Briefcase, Calendar, Award, GraduationCap,
  Lock, Server, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// @ts-ignore
import Tree from 'react-d3-tree';

// 定义技能节点类型
interface SkillNodeAttribute {
  description?: string;
  level?: number;
  maxLevel?: number;
  category?: string;
  effects?: string[];
  requirements?: string[];
  criteria?: string[]; // 增加评定标准
  masteryLevels?: {[key: number]: string}; // 增加各级掌握程度描述
}

interface SkillNode {
  name: string;
  attributes?: SkillNodeAttribute;
  children?: SkillNode[];
}

interface RenderSkillNodeProps {
  nodeDatum: SkillNode;
  onNodeClick: (nodeData: SkillNode) => void;
}

const SkillJourneySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");
  const [skillProgress, setSkillProgress] = useState<Record<string, number>>({});
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [toolCategory, setToolCategory] = useState<string>("all");
  const [expandedJobs, setExpandedJobs] = useState<string[]>([]);
  const [careerType, setCareerType] = useState<string>("all");
  const [activeSkillNode, setActiveSkillNode] = useState<SkillNode | null>(null);
  const [activeChildNode, setActiveChildNode] = useState<SkillNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [treeScale, setTreeScale] = useState(1);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(0);

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

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [containerRef]);

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

  // 职业历程数据
  const careerHistory = [
    {
      id: "job1",
      company: "某科技公司",
      position: "高级数据分析师",
      duration: "2022年3月 - 至今",
      type: "fulltime",
      industry: "互联网",
      responsibilities: [
        "负责大规模数据集的分析与洞察挖掘",
        "开发和优化数据分析模型与工具",
        "为产品决策提供数据支持",
        "跨部门协作完成重要数据项目"
      ],
      achievements: [
        "领导的数据分析项目提高了产品转化率15%",
        "设计的自动化报表系统节省团队40%工作时间",
        "获得年度最佳数据分析师称号"
      ],
      skills: ["Python", "SQL", "数据可视化", "机器学习", "A/B测试"],
      projects: [
        {
          name: "用户行为分析平台",
          description: "构建实时用户行为分析平台，支持多维度数据分析",
          impact: "帮助产品团队优化用户体验，提升用户留存率8%"
        }
      ],
      color: "from-blue-500 to-indigo-600",
      icon: <Database className="w-7 h-7 text-blue-500" />
    },
    {
      id: "job2",
      company: "创新数据咨询",
      position: "数据分析师",
      duration: "2020年7月 - 2022年2月",
      type: "fulltime",
      industry: "咨询",
      responsibilities: [
        "为客户提供数据分析解决方案",
        "构建数据可视化仪表板",
        "撰写数据分析报告",
        "协助客户实现数据驱动决策"
      ],
      achievements: [
        "开发的客户细分模型为重点客户提升了营收12%",
        "优化的数据处理流程减少了报告生成时间75%",
        "成功为10+客户提供数据解决方案"
      ],
      skills: ["R", "Tableau", "Power BI", "统计分析", "客户沟通"],
      projects: [
        {
          name: "零售客户分析系统",
          description: "为零售客户开发全面的用户分析系统",
          impact: "帮助客户发现潜在高价值用户群体，提升营销投资回报率23%"
        }
      ],
      color: "from-green-500 to-emerald-600",
      icon: <LineChart className="w-7 h-7 text-green-500" />
    },
    {
      id: "job3",
      company: "数据创业公司",
      position: "数据分析实习生",
      duration: "2019年6月 - 2020年6月",
      type: "internship",
      industry: "初创",
      responsibilities: [
        "支持数据收集和清洗工作",
        "协助开发基础数据模型",
        "参与数据可视化项目",
        "编写周期性数据报告"
      ],
      achievements: [
        "参与开发的用户分析工具被公司采纳",
        "编写的自动化脚本提高了数据处理效率30%",
        "获得最佳实习生评价"
      ],
      skills: ["Python基础", "数据清洗", "基础统计", "数据可视化入门"],
      projects: [
        {
          name: "市场趋势分析",
          description: "分析行业数据，识别市场趋势和机会",
          impact: "为公司产品开发提供了关键市场洞察"
        }
      ],
      color: "from-purple-500 to-violet-600",
      icon: <BarChart3 className="w-7 h-7 text-purple-500" />
    },
    {
      id: "proj1",
      company: "个人项目",
      position: "全栈开发者",
      duration: "2021年9月 - 2022年2月",
      type: "project",
      industry: "个人开发",
      responsibilities: [
        "独立设计和开发Web应用程序",
        "实现前端界面和后端API",
        "部署和维护应用程序",
        "收集用户反馈并迭代改进"
      ],
      achievements: [
        "成功开发并上线一个实用工具网站",
        "获得500+用户注册",
        "通过项目掌握了全栈开发技能"
      ],
      skills: ["React", "Node.js", "MongoDB", "AWS", "响应式设计"],
      projects: [
        {
          name: "数据可视化平台",
          description: "开发一个允许用户上传和可视化数据的Web应用",
          impact: "为非技术用户提供了简单易用的数据分析工具"
        }
      ],
      color: "from-amber-500 to-orange-600",
      icon: <Code className="w-7 h-7 text-amber-500" />
    }
  ];

  // 获取技能树数据
  const getSkillTreeData = () => {
    // 模拟RPG技能树数据
    const skillTreeData: SkillNode = {
      name: '核心技能',
      attributes: {
        description: '所有技能的起点，代表基本的学习和成长能力。这是个人发展的基础，所有专业技能都建立在这个核心之上。',
        level: 1,
        maxLevel: 1,
        category: 'core',
        masteryLevels: {
          1: '已具备基本的学习能力和成长思维，可以开始专业技能的学习和发展。'
        }
      },
      children: [
        {
          name: '前端开发',
          attributes: {
            description: '前端开发相关技能，包括HTML、CSS、JavaScript及现代前端框架的掌握和应用。能够创建响应式、交互式的Web界面。',
            level: 0,
            maxLevel: 3,
            category: 'development',
            effects: ['界面开发能力 +1', '用户体验设计 +1', '技术实现能力 +1'],
            requirements: ['核心技能 Lv.1'],
            masteryLevels: {
              1: '掌握基本的HTML、CSS和JavaScript，能够创建简单的网页和交互效果。',
              2: '熟练运用现代前端框架，能够开发复杂的单页应用，理解前端性能优化原则。',
              3: '精通前端架构设计，能够构建大型应用，深入理解浏览器渲染原理和性能优化技术。'
            },
            criteria: [
              '能够使用HTML、CSS创建符合设计规范的页面',
              '掌握JavaScript核心概念和DOM操作',
              '了解现代前端开发工具链和构建流程',
              '能够使用至少一种主流前端框架'
            ]
          },
          children: [
            {
              name: 'React精通',
              attributes: {
                description: '掌握React组件化开发和状态管理，深入理解React的核心概念和生态系统。能够构建高性能、可维护的React应用。',
                level: 0,
                maxLevel: 5,
                category: 'development',
                effects: ['组件开发 +2', '状态管理 +2', '性能优化 +1', '代码质量 +1'],
                requirements: ['前端开发 Lv.1'],
                masteryLevels: {
                  1: '了解React基础概念，能够创建简单组件和使用基本Hooks。',
                  2: '熟练使用React Hooks和Context API，理解组件生命周期，能够处理表单和事件。',
                  3: '掌握Redux或其他状态管理库，理解虚拟DOM和协调算法，能够进行基本性能优化。',
                  4: '精通React性能优化技术，能够使用高级模式如HOC、Render Props，理解React源码原理。',
                  5: '能够构建企业级React应用架构，深入理解React内部实现，有能力贡献开源React生态。'
                },
                criteria: [
                  '理解并正确应用React组件生命周期',
                  '熟练使用React Hooks进行函数式组件开发',
                  '掌握至少一种状态管理方案(Redux/MobX等)',
                  '能够识别和解决React应用中的性能问题',
                  '理解React的虚拟DOM和Diff算法工作原理'
                ]
              }
            },
            {
              name: 'CSS高手',
              attributes: {
                description: '掌握高级CSS技术和动画效果，能够实现复杂的布局和交互设计。精通现代CSS框架和预处理器。',
                level: 0,
                maxLevel: 4,
                category: 'development',
                effects: ['界面美观度 +2', '响应式设计 +1', '动画效果 +2', '设计系统实现 +1'],
                requirements: ['前端开发 Lv.1'],
                masteryLevels: {
                  1: '掌握CSS基础选择器和属性，能够实现简单的布局和样式。',
                  2: '熟练使用Flexbox和Grid布局，了解CSS动画和过渡效果，能够实现响应式设计。',
                  3: '掌握CSS预处理器和框架，精通复杂布局技术，能够创建高级动画效果。',
                  4: '能够建立完整的设计系统和组件库，深入理解CSS性能优化和浏览器渲染原理。'
                },
                criteria: [
                  '熟练掌握CSS选择器和盒模型',
                  '精通Flexbox和Grid布局系统',
                  '能够实现复杂的响应式设计',
                  '掌握CSS动画和交互效果技术',
                  '理解并能优化CSS性能问题'
                ]
              }
            },
            {
              name: 'JavaScript进阶',
              attributes: {
                description: '深入理解JavaScript语言特性、异步编程和模块化开发，掌握现代ES6+语法和前沿特性。',
                level: 0,
                maxLevel: 5,
                category: 'development',
                effects: ['代码质量 +2', '问题解决 +2', '性能优化 +1', '架构设计 +1'],
                requirements: ['前端开发 Lv.1'],
                masteryLevels: {
                  1: '掌握JavaScript基础语法和常用API，能够处理DOM操作和基本事件。',
                  2: '理解JavaScript的作用域、闭包和原型链，掌握ES6+特性，能处理异步操作。',
                  3: '精通JavaScript模块化开发和设计模式，能够构建复杂应用和处理性能问题。',
                  4: '深入理解JavaScript运行机制和内存管理，能够编写高性能代码和优化应用。',
                  5: '精通JavaScript语言规范和最新特性，能够贡献开源项目和创建自己的JavaScript库。'
                },
                criteria: [
                  '深入理解JavaScript核心概念（闭包、原型、this等）',
                  '熟练使用ES6+特性进行开发',
                  '掌握异步编程和Promise/async-await',
                  '能够实现模块化设计和代码组织',
                  '理解JavaScript性能优化策略'
                ]
              }
            }
          ]
        },
        {
          name: '后端开发',
          attributes: {
            description: '服务器端开发技能，包括API设计、数据库操作、认证授权和性能优化等。能够构建稳定、安全、高性能的后端服务。',
            level: 0,
            maxLevel: 3,
            category: 'backend',
            effects: ['系统设计 +1', '数据处理 +1', '架构能力 +1'],
            requirements: ['核心技能 Lv.1'],
            masteryLevels: {
              1: '理解基本的服务器端概念，能够使用框架创建简单API和处理数据存储。',
              2: '熟练设计RESTful API，掌握数据库优化，能够实现认证授权和安全防护。',
              3: '精通后端架构设计，能够构建高并发、高可用的分布式系统和微服务架构。'
            },
            criteria: [
              '能够设计和实现RESTful API',
              '熟练使用至少一种后端编程语言和框架',
              '掌握数据库设计和查询优化',
              '了解基本的安全防护措施',
              '能够构建完整的后端服务'
            ]
          },
          children: [
            {
              name: 'Node.js开发',
              attributes: {
                description: '使用Node.js构建高性能服务器应用，掌握事件驱动和非阻塞I/O编程模型，熟练使用npm生态系统。',
                level: 0,
                maxLevel: 4,
                category: 'backend',
                effects: ['API开发 +2', '实时应用 +2', '中间件开发 +1', '性能调优 +1'],
                requirements: ['后端开发 Lv.1'],
                masteryLevels: {
                  1: '理解Node.js基础概念，能够创建简单HTTP服务器和处理路由。',
                  2: '熟练使用Express/Nest.js等框架，能够实现完整API和数据库集成。',
                  3: '掌握Node.js性能优化和调试技术，能够处理并发和内存泄漏问题。',
                  4: '精通Node.js内部原理，能够开发复杂应用和贡献核心模块。'
                },
                criteria: [
                  '理解Node.js事件循环和异步编程模型',
                  '熟练使用npm管理项目依赖',
                  '能够使用框架构建完整的API服务',
                  '掌握Node.js性能调优和问题诊断',
                  '了解常见的安全漏洞和防护措施'
                ]
              }
            },
            {
              name: '数据库精通',
              attributes: {
                description: '深入理解关系型和NoSQL数据库，掌握数据建模、查询优化和事务管理，能够设计高性能、可扩展的数据存储方案。',
                level: 0,
                maxLevel: 4,
                category: 'backend',
                effects: ['数据架构 +2', '查询性能 +2', '数据安全 +1', '系统可靠性 +1'],
                requirements: ['后端开发 Lv.1'],
                masteryLevels: {
                  1: '掌握基本SQL语法，能够进行CRUD操作和设计简单数据模型。',
                  2: '熟练使用多种类型数据库，理解索引和事务，能够优化简单查询。',
                  3: '精通数据库架构设计，能够实现分片、复制等高级技术，优化复杂查询。',
                  4: '能够设计大规模数据库系统，深入理解存储引擎和底层实现，处理极限性能挑战。'
                },
                criteria: [
                  '熟练编写高效的SQL查询',
                  '理解并正确使用数据库索引',
                  '能够设计规范化的数据模型',
                  '掌握数据库事务和并发控制',
                  '理解NoSQL和关系型数据库的适用场景'
                ]
              }
            }
          ]
        },
        {
          name: '数据分析',
          attributes: {
            description: '数据处理与分析能力，包括数据清洗、统计分析、数据挖掘和预测建模。能够从数据中提取有价值的洞察和支持决策。',
            level: 0,
            maxLevel: 3,
            category: 'data',
            effects: ['数据洞察 +1', '决策支持 +1', '问题分析 +1'],
            requirements: ['核心技能 Lv.1'],
            masteryLevels: {
              1: '掌握基本数据处理和统计分析技术，能够进行描述性统计和简单可视化。',
              2: '熟练使用数据分析工具和算法，能够处理复杂数据集并提取洞察。',
              3: '精通高级统计和机器学习技术，能够构建预测模型和自动化分析流程。'
            },
            criteria: [
              '熟练使用数据分析工具和语言(Python/R等)',
              '掌握数据清洗和预处理技术',
              '了解基本统计概念和假设检验',
              '能够使用合适的可视化表达数据',
              '具备将数据转化为业务洞察的能力'
            ]
          },
          children: [
            {
              name: '数据可视化',
              attributes: {
                description: '创建交互式数据可视化图表和仪表盘，能够有效传达数据故事和洞察，使复杂数据易于理解和决策。',
                level: 0,
                maxLevel: 4,
                category: 'data',
                effects: ['图表制作 +2', '数据故事讲述 +1', '信息美学 +1', '交互设计 +1'],
                requirements: ['数据分析 Lv.1'],
                masteryLevels: {
                  1: '掌握基本图表类型和制作方法，能够创建静态可视化展示。',
                  2: '熟练使用可视化库和工具，能够根据数据特性选择合适的可视化方式。',
                  3: '能够创建交互式仪表盘和复杂可视化，有效传达数据故事和洞察。',
                  4: '精通数据可视化设计原则和高级技术，能够创建创新型可视化解决方案。'
                },
                criteria: [
                  '熟练使用主流可视化工具和库',
                  '理解不同图表类型的适用场景',
                  '能够创建有效传达信息的可视化',
                  '掌握交互式可视化技术',
                  '了解可视化设计原则和颜色理论'
                ]
              }
            },
            {
              name: '机器学习',
              attributes: {
                description: '应用机器学习算法解决实际问题，包括监督学习、无监督学习和深度学习技术，能够构建智能化的预测和分类系统。',
                level: 0,
                maxLevel: 5,
                category: 'data',
                effects: ['预测分析 +2', '模式识别 +2', '自动化决策 +1', '数据价值挖掘 +1'],
                requirements: ['数据分析 Lv.2'],
                masteryLevels: {
                  1: '理解机器学习基本概念，能够应用简单算法进行预测和分类。',
                  2: '熟练使用主流机器学习库，能够处理特征工程和模型评估。',
                  3: '掌握多种高级算法和深度学习基础，能够解决复杂问题。',
                  4: '精通深度学习和先进模型，能够实现定制化算法和优化大规模应用。',
                  5: '能够研发创新算法和方法，解决行业前沿问题，推动机器学习技术发展。'
                },
                criteria: [
                  '理解常见机器学习算法原理',
                  '熟练进行数据预处理和特征工程',
                  '掌握模型评估和超参数调优',
                  '能够实现完整的机器学习项目',
                  '了解模型解释性和道德考量'
                ]
              }
            },
            {
              name: '大数据处理',
              attributes: {
                description: '处理和分析大规模数据集，掌握分布式计算框架和存储系统，能够构建高效的数据处理管道和实时分析系统。',
                level: 0,
                maxLevel: 4,
                category: 'data',
                effects: ['数据处理能力 +2', '系统扩展性 +2', '实时分析 +1', '数据架构 +1'],
                requirements: ['数据分析 Lv.2'],
                masteryLevels: {
                  1: '了解大数据基本概念，能够使用基础工具处理中等规模数据。',
                  2: '熟练使用Hadoop、Spark等框架，能够实现批处理和简单实时分析。',
                  3: '精通分布式数据处理技术，能够设计和优化大数据处理流程。',
                  4: '能够构建企业级大数据平台，掌握最新技术和架构，解决极限规模挑战。'
                },
                criteria: [
                  '熟练使用分布式计算框架',
                  '理解大数据存储系统和计算模型',
                  '能够实现高效数据处理管道',
                  '掌握数据处理性能优化技术',
                  '了解实时流处理和批处理的权衡'
                ]
              }
            }
          ]
        },
        {
          name: '设计能力',
          attributes: {
            description: 'UI/UX设计相关技能，包括用户研究、交互设计、视觉设计和原型设计。能够创造美观、易用且满足用户需求的产品体验。',
            level: 0,
            maxLevel: 3,
            category: 'design',
            effects: ['视觉美感 +1', '用户体验 +1', '创意思维 +1'],
            requirements: ['核心技能 Lv.1'],
            masteryLevels: {
              1: '了解基本设计原则和工具，能够创建简单界面和原型。',
              2: '熟练运用设计方法和专业工具，能够独立完成中等复杂度的设计项目。',
              3: '精通设计系统和高级技术，能够领导复杂产品的设计过程和团队协作。'
            },
            criteria: [
              '熟练使用设计工具(Figma/Sketch等)',
              '理解用户体验设计原则',
              '能够创建有效的视觉层次和信息架构',
              '了解设计系统和组件库',
              '具备用户同理心和需求洞察能力'
            ]
          },
          children: [
            {
              name: '用户体验设计',
              attributes: {
                description: '创造优秀的用户体验，通过用户研究、信息架构、交互设计和用户测试，打造易用、高效且令人愉悦的产品。',
                level: 0,
                maxLevel: 4,
                category: 'design',
                effects: ['用户满意度 +2', '交互设计 +1', '易用性 +1', '用户洞察 +2'],
                requirements: ['设计能力 Lv.1'],
                masteryLevels: {
                  1: '了解UX基本原则，能够创建简单的用户流程和线框图。',
                  2: '能够进行用户研究和测试，创建详细的交互设计和有效的信息架构。',
                  3: '精通用户体验方法论，能够解决复杂问题并领导端到端设计过程。',
                  4: '能够建立UX战略和设计系统，优化整体产品生态系统和用户体验。'
                },
                criteria: [
                  '掌握用户研究和测试方法',
                  '能够创建清晰的用户流程和信息架构',
                  '熟练设计交互模式和微交互',
                  '理解可用性原则和评估方法',
                  '能够基于数据和反馈优化设计'
                ]
              }
            },
            {
              name: '视觉设计',
              attributes: {
                description: '创造吸引人的视觉效果，运用排版、色彩、布局和图像，打造有品牌辨识度且美观的界面设计。',
                level: 0,
                maxLevel: 4,
                category: 'design',
                effects: ['品牌识别 +1', '视觉层次 +2', '色彩运用 +1', '美学表达 +2'],
                requirements: ['设计能力 Lv.1'],
                masteryLevels: {
                  1: '了解基本设计元素和原则，能够创建简单的视觉作品。',
                  2: '熟练运用排版、色彩和布局技巧，能够创建有效的视觉传达。',
                  3: '精通视觉设计语言和品牌设计，能够建立一致的视觉系统。',
                  4: '能够创造独特的视觉风格和创新表达，引领设计趋势和美学方向。'
                },
                criteria: [
                  '熟练掌握排版和网格系统',
                  '理解色彩理论和有效运用色彩',
                  '能够创建清晰的视觉层次',
                  '掌握图像处理和图标设计',
                  '了解不同平台的视觉设计规范'
                ]
              }
            },
            {
              name: '交互设计',
              attributes: {
                description: '设计用户与产品间的交互流程和体验，包括导航系统、反馈机制和微交互，创造直观且愉悦的使用体验。',
                level: 0,
                maxLevel: 4,
                category: 'design',
                effects: ['用户引导 +2', '操作流畅度 +2', '系统反馈 +1', '使用满意度 +1'],
                requirements: ['设计能力 Lv.1'],
                masteryLevels: {
                  1: '了解基本交互原则，能够设计简单的交互流程。',
                  2: '熟练设计各种交互模式，能够优化用户流程和提供有效反馈。',
                  3: '精通复杂系统的交互设计，能够创造创新的交互解决方案。',
                  4: '能够定义交互设计语言和标准，构建一致且独特的交互体验。'
                },
                criteria: [
                  '理解常见交互模式和最佳实践',
                  '能够设计清晰的导航系统',
                  '掌握微交互设计和动效原则',
                  '了解不同设备的交互特性',
                  '能够创建有效的反馈机制'
                ]
              }
            }
          ]
        },
        {
          name: 'AI技术',
          attributes: {
            description: '人工智能相关技术和应用，包括大语言模型应用、智能系统开发和AI解决方案设计。能够将AI技术应用于实际业务场景。',
            level: 0,
            maxLevel: 3,
            category: 'ai',
            effects: ['智能解决方案 +1', '自动化能力 +1', '创新应用 +1'],
            requirements: ['核心技能 Lv.1'],
            masteryLevels: {
              1: '了解AI基础概念和应用场景，能够使用现有API构建简单应用。',
              2: '熟练运用多种AI技术和平台，能够设计和实现综合解决方案。',
              3: '精通AI系统架构和前沿技术，能够构建创新应用和优化复杂场景。'
            },
            criteria: [
              '理解人工智能核心概念和类型',
              '熟练使用至少一种AI开发平台或库',
              '能够识别适合AI应用的业务场景',
              '了解AI系统的局限性和伦理考量',
              '具备将AI融入产品的实施能力'
            ]
          },
          children: [
            {
              name: 'LLM应用开发',
              attributes: {
                description: '利用大语言模型(LLM)创建智能应用，包括提示工程、上下文管理和模型调优，构建对话式AI和智能助手系统。',
                level: 0,
                maxLevel: 4,
                category: 'ai',
                effects: ['智能对话 +2', '内容生成 +2', '知识处理 +1', '流程自动化 +1'],
                requirements: ['AI技术 Lv.1'],
                masteryLevels: {
                  1: '了解LLM基本概念，能够使用API创建简单对话应用。',
                  2: '熟练设计提示策略，能够构建多轮对话和特定领域应用。',
                  3: '精通LLM应用架构，能够实现复杂场景和自定义解决方案。',
                  4: '能够优化和定制模型，创建先进的AI应用生态和创新用例。'
                },
                criteria: [
                  '掌握有效的提示工程技术',
                  '理解上下文管理和对话设计',
                  '能够设计领域特定的应用流程',
                  '了解模型性能评估和优化',
                  '具备AI应用的伦理和安全意识'
                ]
              }
            },
            {
              name: '计算机视觉',
              attributes: {
                description: '开发能够理解和处理视觉信息的系统，包括图像识别、物体检测和视频分析，应用于各种实际场景。',
                level: 0,
                maxLevel: 4,
                category: 'ai',
                effects: ['图像处理 +2', '视觉识别 +2', '空间分析 +1', '多模态融合 +1'],
                requirements: ['AI技术 Lv.1'],
                masteryLevels: {
                  1: '理解计算机视觉基础，能够使用现有模型进行简单任务。',
                  2: '熟练应用各种视觉算法，能够处理实际图像和视频数据。',
                  3: '精通高级视觉处理技术，能够构建完整的视觉分析系统。',
                  4: '能够研发创新算法和方法，解决复杂视觉问题和前沿挑战。'
                },
                criteria: [
                  '熟练使用计算机视觉库和框架',
                  '理解常见图像处理技术',
                  '掌握深度学习在视觉中的应用',
                  '能够设计端到端视觉解决方案',
                  '了解计算机视觉的实际限制'
                ]
              }
            },
            {
              name: 'AI系统集成',
              attributes: {
                description: '将AI技术整合到现有系统和业务流程中，设计和实现端到端的智能化解决方案，优化业务效率和决策过程。',
                level: 0,
                maxLevel: 4,
                category: 'ai',
                effects: ['系统智能化 +2', '流程优化 +2', '决策支持 +1', '技术融合 +1'],
                requirements: ['AI技术 Lv.2'],
                masteryLevels: {
                  1: '理解AI集成基础，能够实现简单API对接和功能整合。',
                  2: '熟练设计AI增强系统，能够优化现有流程和构建智能服务。',
                  3: '精通复杂AI系统架构，能够实现跨平台智能解决方案和服务编排。',
                  4: '能够构建创新的AI生态系统，设计智能企业架构和前沿应用模式。'
                },
                criteria: [
                  '理解AI系统与传统系统的整合方式',
                  '熟练设计智能化业务流程',
                  '掌握多种AI服务的组合技术',
                  '能够评估和管理AI系统的风险',
                  '了解AI系统的可扩展性和维护策略'
                ]
              }
            }
          ]
        },
        {
          name: 'AI工程',
          attributes: {
            description: '人工智能应用开发与集成技能，包括提示工程、大模型调用和AI解决方案设计。能够有效利用AI技术解决实际问题。',
            level: 0,
            maxLevel: 3,
            category: 'aieng',
            effects: ['智能解决方案 +1', '自动化效率 +1', '创新应用 +1'],
            requirements: ['核心技能 Lv.1'],
            masteryLevels: {
              1: '掌握基本AI交互技巧，能够有效使用AI工具提升工作效率。',
              2: '熟练设计AI提示和应用场景，能够构建基于AI的解决方案。',
              3: '精通AI系统集成和定制化开发，能够打造创新的AI驱动产品和服务。'
            },
            criteria: [
              '熟练掌握提示工程技术',
              '理解大语言模型的能力和局限',
              '能够设计AI工作流和应用架构',
              '了解AI伦理和安全最佳实践',
              '掌握AI与传统系统的集成方法'
            ]
          },
          children: [
            {
              name: '提示工程',
              attributes: {
                description: '设计和优化与AI系统交互的提示语，提高AI输出质量，使其更符合特定需求和上下文。',
                level: 0,
                maxLevel: 4,
                category: 'aieng',
                effects: ['AI输出质量 +2', '问题解决 +1', '创意表达 +1', '效率提升 +2'],
                requirements: ['AI工程 Lv.1'],
                masteryLevels: {
                  1: '了解基本提示技巧，能够编写简单明确的AI指令。',
                  2: '熟练运用提示模式和策略，能够引导AI生成高质量内容。',
                  3: '精通复杂任务的提示设计，能够构建多步骤、上下文丰富的交互流程。',
                  4: '能够设计提示系统和框架，优化特定领域的AI应用，创建创新交互模式。'
                },
                criteria: [
                  '掌握明确、具体的提示语设计',
                  '理解上下文和示例在提示中的作用',
                  '能够有效引导AI思维过程',
                  '掌握提示评估和迭代优化方法',
                  '了解不同AI模型的提示偏好'
                ]
              }
            },
            {
              name: 'AI应用集成',
              attributes: {
                description: '将AI能力整合到实际应用和工作流程中，设计端到端的智能化解决方案，提升产品和服务价值。',
                level: 0,
                maxLevel: 4,
                category: 'aieng',
                effects: ['智能自动化 +2', '用户体验 +2', '业务转型 +1', '创新能力 +1'],
                requirements: ['AI工程 Lv.1'],
                masteryLevels: {
                  1: '掌握基本AI API调用，能够将简单AI功能集成到应用中。',
                  2: '熟练设计AI增强型应用，能够构建结合多种AI能力的解决方案。',
                  3: '精通AI系统架构和优化，能够处理复杂场景和性能需求。',
                  4: '能够设计创新AI产品和服务，打造端到端的智能化生态系统。'
                },
                criteria: [
                  '熟练使用AI服务API和SDK',
                  '理解AI能力与业务需求的匹配',
                  '掌握AI应用的用户体验设计',
                  '能够处理AI系统的不确定性',
                  '了解AI应用的伦理和责任设计'
                ]
              }
            }
          ]
        }
      ]
    };
    
    // 根据当前过滤条件筛选技能
    if (toolCategory === 'all') {
      return skillTreeData;
    }
    
    // 深度复制对象
    const filteredData: SkillNode = JSON.parse(JSON.stringify(skillTreeData));
    
    // 递归过滤函数
    const filterNode = (node: SkillNode): SkillNode | null => {
      if (node.children) {
        // 过滤子节点
        node.children = node.children
          .filter(child => {
            const childCategory = child.attributes?.category;
            // 保留符合类别的节点，或有子节点的节点
            return childCategory === toolCategory || (child.children && child.children.length > 0);
          })
          .map(filterNode)
          .filter((node): node is SkillNode => node !== null); // 过滤掉null值
        
        // 如果过滤后没有子节点，可以选择返回null或保留节点
        return node.children.length > 0 ? node : null;
      }
      
      return node;
    };
    
    return filterNode(filteredData) || { name: '无数据', children: [] };
  };
  
  // 处理技能节点点击
  const handleSkillNodeClick = (nodeData: SkillNode) => {
    // 如果点击的是已经激活的节点，则取消选择
    if (activeSkillNode && activeSkillNode.name === nodeData.name) {
      setActiveSkillNode(null);
      setActiveChildNode(null);
    } else {
      // 检查是否为子技能(节点没有children或parent节点不为activeSkillNode)
      const isChildNode = !nodeData.children || nodeData.children.length === 0;
      
      if (isChildNode && activeSkillNode && activeSkillNode.children && 
          activeSkillNode.children.some(child => child.name === nodeData.name)) {
        // 如果是子技能，并且其父节点已经是当前活动节点
        setActiveChildNode(nodeData);
      } else {
        // 如果是主技能节点，则正常设置activeSkillNode
      setActiveSkillNode(nodeData);
        setActiveChildNode(null);
      }
    }
  };
  
  // 自定义节点渲染
  const renderSkillNode = ({ nodeDatum, onNodeClick }: RenderSkillNodeProps) => {
    const { name, attributes = {} } = nodeDatum;
    const { level = 0, maxLevel = 1, category = 'core' } = attributes;
    
    // 根据类别和等级确定节点颜色
    const getNodeColor = () => {
      if (level === 0) return '#4b5563'; // 未解锁
      
      switch (category) {
        case 'development': return '#3b82f6';
        case 'data': return '#10b981';
        case 'design': return '#f43f5e';
        default: return '#f59e0b';
      }
    };
    
    // 确定节点样式类
    const getNodeClass = () => {
      if (level === 0) return 'skill-node-locked';
      if (level === maxLevel) return 'skill-node-mastered';
      return 'skill-node-unlocked';
    };
    
    return (
      <g
        onClick={() => onNodeClick(nodeDatum)}
        className={getNodeClass()}
        style={{ cursor: 'pointer' }}
      >
        {/* 技能节点圆形背景 */}
        <circle
          r={25}
          fill={getNodeColor()}
          strokeWidth={level > 0 ? 3 : 1}
          stroke={level === maxLevel ? '#fcd34d' : '#1e293b'}
          style={{ 
            filter: level === maxLevel ? 'drop-shadow(0 0 8px gold)' : (level > 0 ? 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.5))' : 'none'),
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* 技能图标 - 使用 emoji 简化示例 */}
        <text
          textAnchor="middle"
          x="0"
          y="5"
          style={{ 
            fontSize: '16px',
            fontWeight: 'bold',
            fill: level > 0 ? 'white' : '#9ca3af'
          }}
        >
          {getCategoryIcon(category)}
        </text>
        
        {/* 技能等级指示器 */}
        {level > 0 && (
          <g>
            <circle r={8} cx={18} cy={-18} fill="#1e293b" />
            <text 
              x={18} 
              y={-15} 
              textAnchor="middle" 
              style={{ fontSize: '10px', fill: 'white', fontWeight: 'bold' }}
            >
              {level}
            </text>
          </g>
        )}
        
        {/* 技能名称 */}
        <text
          y={45}
          textAnchor="middle"
          style={{ 
            fontSize: '13px', 
            fill: level > 0 ? '#f8fafc' : '#64748b',
            fontWeight: level > 0 ? 'bold' : 'normal',
            textShadow: level > 0 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          {name}
        </text>
      </g>
    );
  };
  
  // 获取类别图标
  const getCategoryIcon = (category: string): React.ReactNode => {
    switch (category) {
      case 'development':
      case '开发技能':
        return <Code className="w-4 h-4 mr-1.5 inline-block" />;
      case 'data':
      case '数据分析':
        return <Database className="w-4 h-4 mr-1.5 inline-block" />;
      case 'design':
      case '设计能力':
        return <Laptop className="w-4 h-4 mr-1.5 inline-block" />;
      case 'backend':
      case '后端开发':
        return <Server className="w-4 h-4 mr-1.5 inline-block" />;
      case 'ai':
      case 'AI技术':
        return <BrainCircuit className="w-4 h-4 mr-1.5 inline-block" />;
      case 'aieng':
      case 'AI工程':
        return <Sparkles className="w-4 h-4 mr-1.5 inline-block" />;
      case 'cloud':
      case '云计算':
        return <Server className="w-4 h-4 mr-1.5 inline-block" />;
      case 'mobile':
      case '移动开发':
        return <Smartphone className="w-4 h-4 mr-1.5 inline-block" />;
      case 'AI与未来':
        return <BrainCircuit className="w-4 h-4 mr-1.5 inline-block" />;
      case '个人成长':
        return <Target className="w-4 h-4 mr-1.5 inline-block" />;
      case '商业思维':
        return <Briefcase className="w-4 h-4 mr-1.5 inline-block" />;
      default:
        return <BookOpen className="w-4 h-4 mr-1.5 inline-block" />;
    }
  };

  // 添加类别颜色和进度条颜色函数
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'development':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'data':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'design':
        return 'bg-gradient-to-r from-rose-500 to-pink-600 text-white';
      case 'backend':
        return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      case 'ai':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white';
      case 'aieng':
        return 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white';
      case 'cloud':
        return 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white';
      case 'mobile':
        return 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
    }
  };

  const getCategoryProgressColor = (category: string): string => {
    switch (category) {
      case 'development':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'data':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'design':
        return 'bg-gradient-to-r from-rose-500 to-pink-600';
      case 'backend':
        return 'bg-gradient-to-r from-purple-500 to-violet-600';
      case 'ai':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600';
      case 'aieng':
        return 'bg-gradient-to-r from-fuchsia-500 to-purple-600';
      case 'cloud':
        return 'bg-gradient-to-r from-sky-500 to-cyan-600';
      case 'mobile':
        return 'bg-gradient-to-r from-orange-500 to-red-600';
      default:
        return 'bg-gradient-to-r from-amber-500 to-orange-600';
    }
  };

  // 新增辅助函数，用于技能卡片布局
  const getSkillCardStyle = (category: string, level: number, isSubSkill: boolean = false): string => {
    // 未解锁的技能卡片样式
    if (level === 0) {
      return isSubSkill
        ? 'bg-slate-100/80 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-300/70 dark:hover:border-slate-600/70'
        : 'bg-slate-100/80 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-300/70 dark:hover:border-slate-600/70';
    }
    
    // 根据类别返回不同的样式
    switch (category) {
      case 'development':
        return isSubSkill
          ? 'bg-blue-50/90 dark:bg-blue-900/30 border-blue-200/60 dark:border-blue-800/40 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:border-blue-300/70 dark:hover:border-blue-700/50'
          : 'bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/60 dark:border-blue-800/40 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 hover:border-blue-300/70 dark:hover:border-blue-700/50';
      case 'data':
        return isSubSkill
          ? 'bg-green-50/90 dark:bg-green-900/30 border-green-200/60 dark:border-green-800/40 hover:bg-green-50 dark:hover:bg-green-900/40 hover:border-green-300/70 dark:hover:border-green-700/50'
          : 'bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200/60 dark:border-green-800/40 hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40 hover:border-green-300/70 dark:hover:border-green-700/50';
      case 'design':
        return isSubSkill
          ? 'bg-rose-50/90 dark:bg-rose-900/30 border-rose-200/60 dark:border-rose-800/40 hover:bg-rose-50 dark:hover:bg-rose-900/40 hover:border-rose-300/70 dark:hover:border-rose-700/50'
          : 'bg-gradient-to-r from-rose-50/90 to-pink-50/90 dark:from-rose-900/30 dark:to-pink-900/30 border-rose-200/60 dark:border-rose-800/40 hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/40 dark:hover:to-pink-900/40 hover:border-rose-300/70 dark:hover:border-rose-700/50';
      case 'backend':
        return isSubSkill
          ? 'bg-purple-50/90 dark:bg-purple-900/30 border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-50 dark:hover:bg-purple-900/40 hover:border-purple-300/70 dark:hover:border-purple-700/50'
          : 'bg-gradient-to-r from-purple-50/90 to-violet-50/90 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200/60 dark:border-purple-800/40 hover:from-purple-50 hover:to-violet-50 dark:hover:from-purple-900/40 dark:hover:to-violet-900/40 hover:border-purple-300/70 dark:hover:border-purple-700/50';
      case 'ai':
        return isSubSkill
          ? 'bg-cyan-50/90 dark:bg-cyan-900/30 border-cyan-200/60 dark:border-cyan-800/40 hover:bg-cyan-50 dark:hover:bg-cyan-900/40 hover:border-cyan-300/70 dark:hover:border-cyan-700/50'
          : 'bg-gradient-to-r from-cyan-50/90 to-blue-50/90 dark:from-cyan-900/30 dark:to-blue-900/30 border-cyan-200/60 dark:border-cyan-800/40 hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/40 dark:hover:to-blue-900/40 hover:border-cyan-300/70 dark:hover:border-cyan-700/50';
      case 'aieng':
        return isSubSkill
          ? 'bg-fuchsia-50/90 dark:bg-fuchsia-900/30 border-fuchsia-200/60 dark:border-fuchsia-800/40 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/40 hover:border-fuchsia-300/70 dark:hover:border-fuchsia-700/50'
          : 'bg-gradient-to-r from-fuchsia-50/90 to-purple-50/90 dark:from-fuchsia-900/30 dark:to-purple-900/30 border-fuchsia-200/60 dark:border-fuchsia-800/40 hover:from-fuchsia-50 hover:to-purple-50 dark:hover:from-fuchsia-900/40 dark:hover:to-purple-900/40 hover:border-fuchsia-300/70 dark:hover:border-fuchsia-700/50';
      case 'cloud':
        return isSubSkill
          ? 'bg-sky-50/90 dark:bg-sky-900/30 border-sky-200/60 dark:border-sky-800/40 hover:bg-sky-50 dark:hover:bg-sky-900/40 hover:border-sky-300/70 dark:hover:border-sky-700/50'
          : 'bg-gradient-to-r from-sky-50/90 to-cyan-50/90 dark:from-sky-900/30 dark:to-cyan-900/30 border-sky-200/60 dark:border-sky-800/40 hover:from-sky-50 hover:to-cyan-50 dark:hover:from-sky-900/40 dark:hover:to-cyan-900/40 hover:border-sky-300/70 dark:hover:border-sky-700/50';
      case 'mobile':
        return isSubSkill
          ? 'bg-orange-50/90 dark:bg-orange-900/30 border-orange-200/60 dark:border-orange-800/40 hover:bg-orange-50 dark:hover:bg-orange-900/40 hover:border-orange-300/70 dark:hover:border-orange-700/50'
          : 'bg-gradient-to-r from-orange-50/90 to-red-50/90 dark:from-orange-900/30 dark:to-red-900/30 border-orange-200/60 dark:border-orange-800/40 hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/40 dark:hover:to-red-900/40 hover:border-orange-300/70 dark:hover:border-orange-700/50';
      default:
        return isSubSkill
          ? 'bg-amber-50/90 dark:bg-amber-900/30 border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-50 dark:hover:bg-amber-900/40 hover:border-amber-300/70 dark:hover:border-amber-700/50'
          : 'bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200/60 dark:border-amber-800/40 hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/40 dark:hover:to-orange-900/40 hover:border-amber-300/70 dark:hover:border-amber-700/50';
    }
  };

  const getIconBackground = (category: string, isSmall: boolean = false): string => {
    const baseClasses = isSmall ? 'bg-gradient-to-br' : 'bg-gradient-to-br shadow-md border';
    
    switch (category) {
      case 'development':
        return `${baseClasses} from-blue-500 to-indigo-600 ${isSmall ? '' : 'border-blue-400/30 dark:border-blue-600/30'}`;
      case 'data':
        return `${baseClasses} from-green-500 to-emerald-600 ${isSmall ? '' : 'border-green-400/30 dark:border-green-600/30'}`;
      case 'design':
        return `${baseClasses} from-rose-500 to-pink-600 ${isSmall ? '' : 'border-rose-400/30 dark:border-rose-600/30'}`;
      case 'backend':
        return `${baseClasses} from-purple-500 to-violet-600 ${isSmall ? '' : 'border-purple-400/30 dark:border-purple-600/30'}`;
      case 'ai':
        return `${baseClasses} from-cyan-500 to-blue-600 ${isSmall ? '' : 'border-cyan-400/30 dark:border-cyan-600/30'}`;
      case 'aieng':
        return `${baseClasses} from-fuchsia-500 to-purple-600 ${isSmall ? '' : 'border-fuchsia-400/30 dark:border-fuchsia-600/30'}`;
      case 'cloud':
        return `${baseClasses} from-sky-500 to-cyan-600 ${isSmall ? '' : 'border-sky-400/30 dark:border-sky-600/30'}`;
      case 'mobile':
        return `${baseClasses} from-orange-500 to-red-600 ${isSmall ? '' : 'border-orange-400/30 dark:border-orange-600/30'}`;
      default:
        return `${baseClasses} from-amber-500 to-orange-600 ${isSmall ? '' : 'border-amber-400/30 dark:border-amber-600/30'}`;
    }
  };

  const getSkillIcon = (category: string, isSmall: boolean = false, className: string = ''): React.ReactNode => {
    const iconSize = isSmall ? 'w-5 h-5' : 'w-6 h-6';
    const textColor = 'text-white';
    const iconClassName = className || `${iconSize} ${textColor}`;
    
    switch (category) {
      case 'development':
        return <Code className={iconClassName} />;
      case 'data':
        return <Database className={iconClassName} />;
      case 'design':
        return <Laptop className={iconClassName} />;
      case 'backend':
        return <Server className={iconClassName} />;
      case 'ai':
        return <BrainCircuit className={iconClassName} />;
      case 'cloud':
        return <Server className={iconClassName} />;
      case 'mobile':
        return <Smartphone className={iconClassName} />;
      case 'core':
        return <Star className={iconClassName} />;
      default:
        return <Sparkles className={iconClassName} />;
    }
  };

  const getProgressColor = (category: string): string => {
    switch (category) {
      case 'development':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'data':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'design':
        return 'bg-gradient-to-r from-rose-500 to-pink-600';
      default:
        return 'bg-gradient-to-r from-amber-500 to-orange-600';
    }
  };

  // 获取当前需要显示的技能详情节点
  const getCurrentDetailNode = (): SkillNode | null => {
    return activeChildNode || activeSkillNode;
  };

  return (
    <section id="skill-journey-section" className="relative py-24 overflow-hidden">
      {/* 背景效果 - 使用网站的全局背景样式 */}
      <div className="absolute inset-0 bg-neural pointer-events-none -z-10"></div>
      
      {/* 全屏背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/50 dark:from-slate-950/90 dark:via-blue-950/30 dark:to-indigo-950/40 backdrop-blur-[2px] -z-10"></div>
      
      {/* 浮动装饰图形 */}
      <div className="absolute top-0 right-0 w-[35rem] h-[35rem] bg-blue-200 dark:bg-blue-800/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-200 dark:bg-indigo-800/20 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      {/* 装饰几何图形 */}
      <div className="absolute top-20 right-1/4 w-40 h-40 border-4 border-blue-200/20 dark:border-blue-600/10 rounded-lg rotate-12 backdrop-blur-sm"></div>
      <div className="absolute bottom-40 left-1/4 w-32 h-32 border-4 border-indigo-200/20 dark:border-indigo-600/10 rounded-full backdrop-blur-sm"></div>
      <div className="absolute top-1/3 left-20 w-24 h-24 rounded-md bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          {/* 顶部标题装饰 */}
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
              <Brain className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">我的专业发展</p>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-50 tracking-tight">
            技能<span className="text-blue-600 dark:text-blue-400 relative inline-block">
              成长
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 dark:from-blue-400/80 dark:to-indigo-400/80 rounded-full"></span>
            </span>与旅程
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            探索我的技能发展历程以及未来发展目标，了解我如何持续提升专业能力
          </p>
        </div>

        <Tabs 
          defaultValue="skills" 
          className="w-full max-w-6xl mx-auto"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-10">
            <TabsList className="inline-flex p-1 rounded-full bg-blue-50/70 dark:bg-slate-800/50 border border-blue-100/50 dark:border-blue-900/30 shadow-md backdrop-blur-sm">
              <TabsTrigger 
                value="skills" 
                className="px-5 py-2.5 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-700 data-[state=inactive]:dark:text-slate-300 transition-all duration-300"
              >
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  <span>专业技能</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="thinking" 
                className="px-5 py-2.5 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-700 data-[state=inactive]:dark:text-slate-300 transition-all duration-300"
              >
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>技能进化树</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="reading" 
                className="px-5 py-2.5 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-700 data-[state=inactive]:dark:text-slate-300 transition-all duration-300"
              >
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>阅读雷达</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 技能选项卡内容 */}
          <TabsContent value="skills" id="skills-content" className="mt-6 focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 技术能力卡片 */}
              <Card className="bg-white/60 dark:bg-slate-800/40 border-none shadow-lg backdrop-blur-md rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-50 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 shadow-sm">
                      <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    技术能力
                  </h3>
                  <div className="space-y-7">
                    {technicalSkills.map((skill, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={skillsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group/skill"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center mr-3 shadow-sm border border-blue-200/30 dark:border-blue-800/30">
                                {skill.icon}
                              </div>
                              <span className="font-semibold text-slate-900 dark:text-slate-50">{skill.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-blue-600 dark:text-blue-400 font-bold">{skill.progress}%</span>
                            </div>
                          </div>
                          <div className="relative ml-12">
                            <div className="h-2 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                              <motion.div 
                                className={`h-full rounded-full ${skill.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${skillsVisible ? skill.progress : 0}%` }}
                                transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                              />
                            </div>
                            <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{skill.description}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 工具掌握卡片 */}
              <Card className="bg-white/60 dark:bg-slate-800/40 border-none shadow-lg backdrop-blur-md rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-50 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 shadow-sm">
                      <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    工具掌握
                  </h3>
                  <div className="space-y-7">
                    {toolSkills.map((skill, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={skillsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="group/skill"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center mr-3 shadow-sm border border-purple-200/30 dark:border-purple-800/30">
                                {skill.icon}
                              </div>
                              <span className="font-semibold text-slate-900 dark:text-slate-50">{skill.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-purple-600 dark:text-purple-400 font-bold">{skill.progress}%</span>
                            </div>
                          </div>
                          <div className="relative ml-12">
                            <div className="h-2 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                              <motion.div 
                                className={`h-full rounded-full ${skill.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${skillsVisible ? skill.progress : 0}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: "easeOut" }}
                              />
                            </div>
                            <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{skill.description}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 技能进化树选项卡内容 */}
          <TabsContent value="thinking" className="mt-6 focus-visible:outline-none">
            <div className="skill-tree-section bg-white/30 dark:bg-slate-800/20 rounded-xl border border-blue-100/30 dark:border-blue-800/20 shadow-lg backdrop-blur-md overflow-hidden">
              {/* 技能树过滤器 */}
              <div className="filter-container flex justify-center gap-3 flex-wrap p-5 border-b border-blue-100/30 dark:border-blue-800/20">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setToolCategory("all")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                    toolCategory === "all" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                      : "bg-blue-50/70 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-blue-100/50 dark:hover:bg-slate-700/70 border border-blue-100/50 dark:border-blue-800/30"
                  }`}
                >
                  <div className="flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    所有技能
                  </div>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setToolCategory("development")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                    toolCategory === "development" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                      : "bg-blue-50/70 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-blue-100/50 dark:hover:bg-slate-700/70 border border-blue-100/50 dark:border-blue-800/30"
                  }`}
                >
                  <div className="flex items-center">
                    <Code className="w-3.5 h-3.5 mr-1.5" />
                    开发技能
                  </div>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setToolCategory("data")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                    toolCategory === "data" 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                      : "bg-blue-50/70 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-blue-100/50 dark:hover:bg-slate-700/70 border border-blue-100/50 dark:border-blue-800/30"
                  }`}
                >
                  <div className="flex items-center">
                    <Database className="w-3.5 h-3.5 mr-1.5" />
                    数据技能
                  </div>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setToolCategory("design")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                    toolCategory === "design" 
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white" 
                      : "bg-blue-50/70 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-blue-100/50 dark:hover:bg-slate-700/70 border border-blue-100/50 dark:border-blue-800/30"
                  }`}
                >
                  <div className="flex items-center">
                    <Laptop className="w-3.5 h-3.5 mr-1.5" />
                    设计技能
                  </div>
                </motion.button>
              </div>
              
              <div className="p-6">
                {/* 新的技能树卡片网格布局 */}
                <div className="grid-skill-layout">
                  {/* 技能线 */}
                  <div className="skill-connections">
                    {/* 线条将在CSS中定义 */}
                  </div>
                  
                  {/* 网格布局 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 第一层：核心技能 - 仅当未选中任何技能或选中的是核心技能时显示完整卡片 */}
                    <div className="md:col-span-3">
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        onClick={() => handleSkillNodeClick(getSkillTreeData())}
                        className={`core-skill-card p-5 rounded-xl border shadow-md cursor-pointer transition-all duration-300 relative overflow-hidden group 
                          ${activeSkillNode && activeSkillNode.name === getSkillTreeData().name 
                            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 dark:from-amber-500/30 dark:to-orange-500/30 border-amber-300 dark:border-amber-600/50 ring-2 ring-amber-400/30 dark:ring-amber-500/20' 
                            : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border-amber-200/50 dark:border-amber-700/30'
                          }`}
                      >
                        <div className="absolute right-0 top-0 bg-gradient-to-l from-amber-500/20 to-transparent w-1/2 h-full transform transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                        <div className="flex items-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mr-4 shadow-xl">
                            <Star className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">核心技能</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">所有技能的起点</p>
                            <div className="flex items-center mt-2">
                              <div className="w-full bg-slate-200/70 dark:bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '100%' }}></div>
                              </div>
                              <span className="ml-2 text-xs font-medium text-slate-600 dark:text-slate-400">Lv.1/1</span>
                            </div>
                          </div>
                          {activeSkillNode && activeSkillNode.name === getSkillTreeData().name && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* 第二层：主要分支技能 */}
                    {getSkillTreeData().children?.map((skillNode: SkillNode, index: number) => (
                      <motion.div
                        key={skillNode.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => handleSkillNodeClick(skillNode)}
                        className={`branch-skill-card p-5 rounded-xl border shadow-md cursor-pointer transition-all duration-300 relative overflow-hidden group 
                          ${activeSkillNode && activeSkillNode.name === skillNode.name 
                            ? `${getSkillCardStyle(skillNode.attributes?.category || 'core', skillNode.attributes?.level || 0)} shadow-lg 
                               ${skillNode.attributes?.category === 'development' 
                                 ? 'ring-2 ring-blue-400/50 dark:ring-blue-500/30 border-blue-300/70 dark:border-blue-600/50 shadow-blue-200/50 dark:shadow-blue-900/30' 
                                 : skillNode.attributes?.category === 'data' 
                                   ? 'ring-2 ring-green-400/50 dark:ring-green-500/30 border-green-300/70 dark:border-green-600/50 shadow-green-200/50 dark:shadow-green-900/30' 
                                   : skillNode.attributes?.category === 'design' 
                                     ? 'ring-2 ring-rose-400/50 dark:ring-rose-500/30 border-rose-300/70 dark:border-rose-600/50 shadow-rose-200/50 dark:shadow-rose-900/30' 
                                     : 'ring-2 ring-amber-400/50 dark:ring-amber-500/30 border-amber-300/70 dark:border-amber-600/50 shadow-amber-200/50 dark:shadow-amber-900/30'}`
                            : getSkillCardStyle(skillNode.attributes?.category || 'core', skillNode.attributes?.level || 0)
                          }`}
                      >
                        <div className="absolute right-0 top-0 bg-gradient-to-l from-white/20 to-transparent w-1/2 h-full transform transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full ${getIconBackground(skillNode.attributes?.category || 'core')} flex items-center justify-center mr-4 shadow-lg`}>
                            {getSkillIcon(skillNode.attributes?.category || 'core')}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{skillNode.name}</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{skillNode.attributes?.description}</p>
                            <div className="flex items-center mt-2">
                              <div className="w-full bg-slate-200/70 dark:bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${getProgressColor(skillNode.attributes?.category || 'core')}`} style={{ width: `${skillNode.attributes?.level && skillNode.attributes?.maxLevel ? (skillNode.attributes.level / skillNode.attributes.maxLevel) * 100 : 0}%` }}></div>
                              </div>
                              <span className="ml-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                {skillNode.attributes?.level && skillNode.attributes?.maxLevel ? 
                                  `Lv.${skillNode.attributes?.level}/${skillNode.attributes?.maxLevel}` : 
                                  (() => {
                                    // 计算解锁条件数量的函数
                                    const getUnlockConditionsCount = () => {
                                      // 如果有子节点（如前端开发），显示子节点数量
                                      if (skillNode.children && skillNode.children.length > 0) {
                                        return skillNode.children.length;
                                      }
                                      
                                      // 如果当前节点有明确定义的解锁条件，返回解锁条件数量
                                      if (skillNode.attributes?.requirements && skillNode.attributes.requirements.length > 0) {
                                        return skillNode.attributes.requirements.length;
                                      }
                                      
                                      // 如果有评定标准，使用评定标准的数量
                                      if (skillNode.attributes?.criteria && skillNode.attributes.criteria.length > 0) {
                                        return skillNode.attributes.criteria.length;
                                      }
                                      
                                      // 没有子节点也没有明确的解锁条件时，根据特定技能名称返回预设的解锁条件数量
                                      switch(skillNode.name) {
                                        case 'React精通':
                                        case 'CSS高手':
                                        case 'JavaScript进阶':
                                        case '提示工程':
                                          return 4;
                                        case 'Node.js开发':
                                        case '数据库精通':
                                          return 3;
                                        default:
                                          return skillNode.attributes?.maxLevel || 3;
                                      }
                                    };
                                    
                                    return `0/${getUnlockConditionsCount()}`;
                                  })()
                                }
                              </span>
                            </div>
                          </div>
                          {skillNode.children && skillNode.children.length > 0 && (
                            <div className="ml-2 w-6 h-6 rounded-full bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                              {/* 移除0/X显示 */}
                            </div>
                          )}
                          {activeSkillNode && activeSkillNode.name === skillNode.name && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* 如果无数据显示提示 */}
                    {(!getSkillTreeData().children || getSkillTreeData().children?.length === 0) && (
                      <div className="md:col-span-3 p-10 text-center">
                        <p className="text-slate-500 dark:text-slate-400">没有符合条件的技能</p>
                      </div>
                    )}
                  </div>
                  
                  {/* 如果选中了非核心节点，显示子技能区 */}
                  {activeSkillNode && activeSkillNode.children && activeSkillNode.children.length > 0 && activeSkillNode.name !== getSkillTreeData().name && (
                    <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/40">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                        <span className="mr-2">{activeSkillNode.name}</span>
                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">的子技能</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {activeSkillNode.children.map((childNode: SkillNode, index: number) => (
                          <motion.div
                            key={childNode.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={(e) => {
                              e.stopPropagation(); // 防止冒泡
                              handleSkillNodeClick(childNode);
                            }}
                            className={`sub-skill-card p-4 rounded-lg border shadow-sm cursor-pointer transition-all duration-300 relative
                              ${(activeChildNode?.name !== childNode.name) 
                                ? getSkillCardStyle(childNode.attributes?.category || 'core', childNode.attributes?.level || 0, true)
                                : `${getSkillCardStyle(childNode.attributes?.category || 'core', childNode.attributes?.level || 0, true)} shadow-md 
                                   ${childNode.attributes?.category === 'development' 
                                     ? 'ring-2 ring-blue-400/40 dark:ring-blue-500/20 border-blue-300/60 dark:border-blue-600/40 shadow-blue-200/40 dark:shadow-blue-900/20' 
                                     : childNode.attributes?.category === 'data' 
                                       ? 'ring-2 ring-green-400/40 dark:ring-green-500/20 border-green-300/60 dark:border-green-600/40 shadow-green-200/40 dark:shadow-green-900/20' 
                                       : childNode.attributes?.category === 'design' 
                                         ? 'ring-2 ring-rose-400/40 dark:ring-rose-500/20 border-rose-300/60 dark:border-rose-600/40 shadow-rose-200/40 dark:shadow-rose-900/20' 
                                         : 'ring-2 ring-amber-400/40 dark:ring-amber-500/20 border-amber-300/60 dark:border-amber-600/40 shadow-amber-200/40 dark:shadow-amber-900/20'}`
                              }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full ${getIconBackground(childNode.attributes?.category || 'core', true)} flex items-center justify-center mr-3 shadow`}>
                                {getSkillIcon(childNode.attributes?.category || 'core', true)}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base font-semibold text-slate-900 dark:text-white">{childNode.name}</h4>
                                <div className="flex flex-col mt-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-slate-600 dark:text-slate-400">进度</span>
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                    {childNode.attributes?.level && childNode.attributes?.maxLevel ? 
                                      `${childNode.attributes?.level}/${childNode.attributes?.maxLevel}` : 
                                      (() => {
                                        // 检查是否有子条件
                                        const getUnlockConditionsCount = (name: string) => {
                                          // 对于特定的技能，指定固定的条件数量
                                          switch(name) {
                                            case 'React精通':
                                            case 'CSS高手':
                                            case 'JavaScript进阶':
                                            case '提示工程':
                                              return 4;
                                            case 'Node.js开发':
                                            case '数据库精通':
                                              return 3;
                                            default:
                                              // 如果有子节点，显示子节点数量
                                              if (childNode.children && childNode.children.length > 0) {
                                                return childNode.children.length;
                                              }
                                              // 如果有评定标准，使用评定标准的数量
                                              if (childNode.attributes?.criteria && childNode.attributes.criteria.length > 0) {
                                                return childNode.attributes.criteria.length;
                                              }
                                              // 如果有解锁条件，显示解锁条件数量
                                              if (childNode.attributes?.requirements && childNode.attributes.requirements.length > 0) {
                                                return childNode.attributes.requirements.length;
                                              }
                                              // 使用maxLevel或默认值3
                                              return childNode.attributes?.maxLevel || 3;
                                          }
                                        };
                                        
                                        return `0/${getUnlockConditionsCount(childNode.name)}`;
                                      })()
                                    }
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200/70 dark:bg-slate-700/50 h-1 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${getProgressColor(childNode.attributes?.category || 'core')}`} style={{ width: `${childNode.attributes?.level && childNode.attributes?.maxLevel ? (childNode.attributes.level / childNode.attributes.maxLevel) * 100 : 0}%` }}></div>
                                </div>
                                </div>
                              </div>
                              {childNode.attributes?.level === 0 && (
                                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-1" />
                              )}
                              {activeChildNode && activeChildNode.name === childNode.name && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 技能详情面板 - 仅当选中技能时显示 */}
                {(activeSkillNode || activeChildNode) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="skill-details-panel mt-8 p-6 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-blue-100/30 dark:border-blue-800/20 backdrop-blur-sm"
                  >
                    <div className="flex items-start">
                      {(() => {
                        const detailNode = getCurrentDetailNode();
                        const category = detailNode?.attributes?.category || 'core';
                        return (
                          <>
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                              getCategoryColor(category)
                      }`}>
                              {getSkillIcon(category, false, 'w-8 h-8 text-white')}
                      </div>
                      <div className="ml-5 flex-1">
                        <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{detailNode?.name}</h3>
                                {detailNode?.attributes?.level !== undefined && detailNode?.attributes?.maxLevel && (
                            <div className="bg-slate-100/80 dark:bg-slate-700/50 px-3 py-1 rounded-full text-sm font-medium">
                                    等级: <span className="text-blue-600 dark:text-blue-400">{detailNode.attributes?.level}</span>
                                    /<span className="text-slate-500 dark:text-slate-400">{detailNode.attributes?.maxLevel}</span>
                            </div>
                          )}
                        </div>
                        
                              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">{detailNode?.attributes?.description}</p>
                      </div>
                          </>
                        )
                      })()}
                    </div>
                    
                    <div className="skill-detail-grid grid grid-cols-1 gap-6 mt-6 w-full">
                      {(() => {
                        const detailNode = getCurrentDetailNode();
                        if (!detailNode) return null;
                        
                        return detailNode.attributes?.level !== undefined && detailNode.attributes?.level > 0 ? (
                        <div className="skill-level-indicator">
                          <h4 className="text-slate-800 dark:text-slate-200 font-medium mb-3 text-sm flex items-center">
                            <Award className="w-4 h-4 mr-1.5 text-amber-500" />
                            技能熟练度
                          </h4>
                          <div className="bg-slate-100/80 dark:bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-700 dark:text-slate-300 font-medium">掌握程度</span>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">{detailNode.attributes?.level}/{detailNode.attributes?.maxLevel}</span>
                            </div>
                            <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-700/80 rounded-full overflow-hidden shadow-inner">
                              <div 
                                  className={`h-full rounded-full ${getCategoryProgressColor(detailNode.attributes?.category || 'core')}`}
                                  style={{ width: `${(detailNode.attributes?.level || 0) / (detailNode.attributes?.maxLevel || 1) * 100}%` }}
                              />
                            </div>
                              
                              {/* 掌握程度描述 */}
                              {detailNode.attributes?.masteryLevels && detailNode.attributes?.level > 0 && (
                                <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/30 rounded-md p-2.5 border border-slate-200/60 dark:border-slate-700/40">
                                  <p className="italic">"{detailNode.attributes?.masteryLevels[detailNode.attributes?.level]}"</p>
                                </div>
                              )}
                            
                            {/* 等级说明 */}
                            <div className="mt-4 grid grid-cols-5 gap-1">
                                {Array.from({ length: detailNode?.attributes?.maxLevel || 5 }).map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`h-1.5 rounded-full ${
                                      i < (detailNode?.attributes?.level || 0)
                                        ? getCategoryProgressColor(detailNode?.attributes?.category || 'core') 
                                      : 'bg-slate-300/50 dark:bg-slate-600/50'
                                  }`}
                                />
                              ))}
                            </div>
                            
                            {/* 解锁条件完成情况 */}
                            <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/40">
                              <h5 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">已完成的条件</h5>
                              
                              {(() => {
                                const category = detailNode?.attributes?.category;
                                const level = detailNode?.attributes?.level || 0;
                                
                                switch(category) {
                                  case 'development':
                                    return (
                                      <>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">完成实战项目</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">1/1</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1 mb-3">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">掌握核心概念</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{Math.min(level+4, 5)}/5</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((level+4)/5, 1) * 100}%` }}></div>
                                        </div>
                                      </>
                                    );
                                  case 'aieng':
                                    return (
                                      <>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">成功的AI提示设计</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{level*5}/10</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1 mb-3">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(level*5/10, 1) * 100}%` }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">AI应用集成案例</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{Math.min(level+1, 3)}/3</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((level+1)/3, 1) * 100}%` }}></div>
                                        </div>
                                      </>
                                    );
                                  case 'data':
                                    return (
                                      <>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">数据分析报告</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{Math.min(level+1, 3)}/3</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1 mb-3">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((level+1)/3, 1) * 100}%` }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">掌握数据处理工具</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{Math.min(level, 2)}/2</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(level/2, 1) * 100}%` }}></div>
                                        </div>
                                      </>
                                    );
                                  case 'design':
                                    return (
                                      <>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">设计作品集</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{Math.min(level*2, 5)}/5</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1 mb-3">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(level*2/5, 1) * 100}%` }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">掌握设计软件</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{Math.min(level, 2)}/2</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(level/2, 1) * 100}%` }}></div>
                                        </div>
                                      </>
                                    );
                                  default:
                                    return (
                                      <>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">完成技能挑战</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{Math.min(level*2, 3)}/3</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1 mb-3">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(level*2/3, 1) * 100}%` }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                          <span className="text-slate-700 dark:text-slate-300">掌握理论知识</span>
                                          <span className="text-green-600 dark:text-green-400 font-medium">{Math.min(level+2, 5)}/5</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1">
                                          <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((level+2)/5, 1) * 100}%` }}></div>
                                        </div>
                                      </>
                                    );
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="skill-level-indicator w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div>
                          <h4 className="text-slate-800 dark:text-slate-200 font-medium mb-3 text-sm flex items-center">
                            <Lock className="w-4 h-4 mr-1.5 text-slate-400" />
                                解锁条件
                          </h4>
                              <div className="bg-slate-100/80 dark:bg-slate-700/50 p-4 rounded-lg h-full">
                                <div className="mb-3 py-2 px-3 rounded-md bg-rose-50/90 dark:bg-rose-900/40 border border-rose-200/60 dark:border-rose-800/40">
                              <p className="text-sm text-rose-600 dark:text-rose-400 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1.5" />
                                    {(() => {
                                      // 计算解锁条件数量的函数
                                      const getUnlockConditionsCount = () => {
                                        if (!detailNode) return 3;
                                        
                                        const name = detailNode.name;
                                        
                                        // 针对特定技能的条件数量
                                        switch(name) {
                                          case 'React精通':
                                          case 'CSS高手':
                                          case 'JavaScript进阶':
                                          case '提示工程':
                                            return 4;
                                          case 'Node.js开发':
                                          case '数据库精通':
                                            return 3;
                                        }
                                        
                                        // 如果是父节点（有子节点的节点），返回子节点数量
                                        if (detailNode.children && detailNode.children.length > 0) {
                                          return detailNode.children.length;
                                        }
                                        
                                        // 如果有评定标准，使用评定标准的数量
                                        if (detailNode.attributes?.criteria && detailNode.attributes.criteria.length > 0) {
                                          return detailNode.attributes.criteria.length;
                                        }
                                        
                                        // 如果有明确定义的解锁条件，返回解锁条件数量
                                        if (detailNode.attributes?.requirements && detailNode.attributes.requirements.length > 0) {
                                          return detailNode.attributes.requirements.length;
                                        }
                                        
                                        // 默认返回3个条件或使用maxLevel值
                                        return detailNode.attributes?.maxLevel || 3;
                                      };
                                      
                                      const count = getUnlockConditionsCount();
                                      return `需完成解锁条件 (0/${count})`;
                                    })()}
                              </p>
                            </div>
                                
                                <div className="space-y-3">
                              {(() => {
                                const node = detailNode;
                                const category = node?.attributes?.category;
                                const name = node?.name;
                                const hasChildren = node?.children && node.children.length > 0;
                                
                                // 对于有子节点的主技能（如"前端开发"），解锁条件是掌握其子技能
                                if (hasChildren && node.children) {
                                  return (
                                    <>
                                      {node.children.map((child, index) => (
                                        <React.Fragment key={index}>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-slate-700 dark:text-slate-300">掌握{child.name}</span>
                                            <span className="text-slate-500 dark:text-slate-400">0/{
                                              // 计算每个子技能所需的解锁条件，显示总数
                                              ((): number => {
                                                // 如果子技能有子节点，数量为子节点数
                                                if (child.children && child.children.length > 0) {
                                                  return child.children.length;
                                                }
                                                // 如果有具体要求条件，显示条件数
                                                if (child.attributes?.requirements && child.attributes.requirements.length > 0) {
                                                  return child.attributes.requirements.length;
                                                }
                                                // 如果有评定标准，显示标准数
                                                if (child.attributes?.criteria && child.attributes.criteria.length > 0) {
                                                  return child.attributes.criteria.length;
                                                }
                                                // 否则返回1
                                                return 1;
                                              })()
                                            }</span>
                          </div>
                                          <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
                                            <div className={`h-full rounded-full ${getCategoryProgressColor(category || 'core')}`} style={{ width: '0%' }}></div>
                        </div>
                                        </React.Fragment>
                                      ))}
                                    </>
                                  );
                                }
                                
                                // 对于子技能（如"React精通"），解锁条件是技能的具体知识点
                                switch (name) {
                                  case 'React精通':
                                    return (
                                      <>
                                        {/* React精通技能的解锁条件 */}
                                        {['理解组件生命周期', '熟练使用React Hooks', '掌握状态管理', '能构建完整React应用'].map((condition, index) => (
                                          <React.Fragment key={index}>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-slate-700 dark:text-slate-300">{condition}</span>
                                              <span className="text-slate-500 dark:text-slate-400">0/1</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
                                              <div className="bg-blue-500 h-full rounded-full" style={{ width: '0%' }}></div>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </>
                                    );
                                  case 'CSS高手':
                                    return (
                                      <>
                                        {/* CSS高手技能的解锁条件 */}
                                        {['掌握Flexbox和Grid布局', '实现响应式设计', '创建CSS动画效果', '使用CSS框架开发UI'].map((condition, index) => (
                                          <React.Fragment key={index}>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-slate-700 dark:text-slate-300">{condition}</span>
                                              <span className="text-slate-500 dark:text-slate-400">0/1</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
                                              <div className="bg-blue-500 h-full rounded-full" style={{ width: '0%' }}></div>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </>
                                    );
                                  case 'JavaScript进阶':
                                    return (
                                      <>
                                        {/* JavaScript进阶技能的解锁条件 */}
                                        {['掌握闭包与作用域', '理解异步编程', '熟练使用ES6+特性', '掌握设计模式应用'].map((condition, index) => (
                                          <React.Fragment key={index}>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-slate-700 dark:text-slate-300">{condition}</span>
                                              <span className="text-slate-500 dark:text-slate-400">0/1</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
                                              <div className="bg-blue-500 h-full rounded-full" style={{ width: '0%' }}></div>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </>
                                    );
                                  case '提示工程':
                                    return (
                                      <>
                                        {/* 提示工程技能的解锁条件 */}
                                        {['编写明确指令提示', '使用上下文和示例', '设计多步骤交互流程', '评估和优化提示效果'].map((condition, index) => (
                                          <React.Fragment key={index}>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-slate-700 dark:text-slate-300">{condition}</span>
                                              <span className="text-slate-500 dark:text-slate-400">0/1</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
                                              <div className="bg-fuchsia-500 h-full rounded-full" style={{ width: '0%' }}></div>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </>
                                    );
                                  default:
                                    // 对于其他子技能或未定义的特殊情况，提供默认解锁条件
                                    const defaultConditions = node?.attributes?.criteria && node.attributes.criteria.length > 0
                                      ? node.attributes.criteria
                                      : ['掌握基础概念', '完成实践项目', '应用核心技术'];
                                    
                                    return (
                                      <>
                                        {defaultConditions.map((condition, index) => (
                                          <React.Fragment key={index}>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-slate-700 dark:text-slate-300">{condition}</span>
                                              <span className="text-slate-500 dark:text-slate-400">0/1</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
                                              <div className={`h-full rounded-full ${getCategoryProgressColor(category || 'core')}`} style={{ width: '0%' }}></div>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </>
                                    );
                                }
                              })()}
                            </div>
                              </div>
                            </div>
                            
                            <div>
                          <h4 className="text-slate-800 dark:text-slate-200 font-medium mb-3 text-sm flex items-center">
                                <GraduationCap className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                                技能解锁指南
                          </h4>
                              <div className="p-4 rounded-lg bg-blue-50/90 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/40 h-full">
                                <div className="space-y-3">
                                  {(() => {
                                    const category = detailNode?.attributes?.category;
                                    switch(category) {
                                      case 'development':
                                        return (
                                          <>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">要解锁{detailNode?.name}技能，您可以：</p>
                                            <ul className="text-sm space-y-2 pl-2">
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">1</span>
                                                </div>
                                                <span>系统学习基础知识：通过官方文档、交互式教程和视频课程，掌握核心概念和基础语法。推荐资源：MDN Web文档、freeCodeCamp、Frontend Masters等专业平台。</span>
                                </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">2</span>
                                                </div>
                                                <span>实践项目驱动学习：从简单的小项目开始，逐步构建复杂应用。每个项目应聚焦特定技能，如：构建响应式布局、实现用户认证、创建数据可视化等。在GitHub上开源您的代码获取反馈。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">3</span>
                                                </div>
                                                <span>代码审查与优化：定期重构您的代码，学习设计模式和最佳实践。参与开源项目，阅读高质量代码库，并从中学习架构设计和编码风格。使用工具如ESLint检查代码质量。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">4</span>
                                                </div>
                                                <span>技术社区参与：加入Stack Overflow、Reddit和Discord技术社区，提问和回答问题。参加线上/线下技术研讨会和黑客马拉松，与其他开发者交流和协作。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">5</span>
                                                </div>
                                                <span>持续学习与更新：关注技术博客、订阅开发者简报如JavaScript Weekly，跟踪前沿技术趋势。每季度学习一个新工具或库，扩展技术栈。记录学习过程，建立个人技术博客。</span>
                                              </li>
                            </ul>
                                          </>
                                        );
                                      case 'data':
                                        return (
                                          <>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">要解锁{detailNode?.name}技能，您可以：</p>
                                            <ul className="text-sm space-y-2 pl-2">
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">1</span>
                          </div>
                                                <span>掌握数据基础：学习统计学基础（描述性统计、概率分布、假设检验）；熟悉SQL查询语言，能够处理复杂数据提取；精通至少一种数据分析编程语言（Python/R），重点掌握pandas、numpy等核心库。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">2</span>
                        </div>
                                                <span>数据可视化能力：学习数据可视化原理，掌握图表类型选择原则；熟练使用可视化工具（Tableau、Power BI）或编程库（Matplotlib、Seaborn、Plotly）；能够创建交互式仪表板，讲述数据故事。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">3</span>
                                                </div>
                                                <span>实战项目：通过Kaggle平台参与数据分析竞赛；使用公开数据集（如UCI机器学习库）构建分析项目；针对特定行业问题（零售、金融、医疗）开展数据分析，产出可行性建议和洞察。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">4</span>
                                                </div>
                                                <span>ETL与数据处理：学习数据清洗、转换和加载技术；掌握处理缺失值、异常值和数据偏斜的方法；了解数据管道构建和数据质量保证流程，如使用Airflow等工具进行工作流自动化。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">5</span>
                                                </div>
                                                <span>业务洞察力：培养商业分析思维，了解KPI和业务指标；学习如何将数据分析结果转化为业务决策建议；训练数据叙事能力，能够向非技术人员清晰地传达数据发现。</span>
                                              </li>
                                            </ul>
                                          </>
                                        );
                                      case 'aieng':
                                        return (
                                          <>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">要解锁{detailNode?.name}技能，您可以：</p>
                                            <ul className="text-sm space-y-2 pl-2">
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-bold">1</span>
                                                </div>
                                                <span>理解AI基础：学习大型语言模型（LLM）的工作原理、能力边界和限制；了解Transformer架构和注意力机制；熟悉主流AI模型（如GPT系列、Claude、Gemini等）的差异和适用场景。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-bold">2</span>
                                                </div>
                                                <span>提示工程技巧：掌握关键提示模式（如Chain-of-Thought、Few-shot learning）；学习提示优化方法（清晰指令、角色设定、任务分解）；实践提示版本控制与评估，建立个人提示库，记录成功案例和模式。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-bold">3</span>
                                                </div>
                                                <span>AI应用开发：使用LangChain、LlamaIndex等框架构建AI应用；学习检索增强生成（RAG）技术，实现与外部知识的连接；掌握AI应用评估方法，如精确度、相关性和安全性测试。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-bold">4</span>
                                                </div>
                                                <span>AI安全与伦理：了解AI偏见、幻觉和安全风险；学习实施内容过滤、输入验证和输出审查机制；建立AI使用的伦理框架，考虑隐私保护、透明度和负责任的AI部署原则。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-bold">5</span>
                                                </div>
                                                <span>实战项目与优化：构建完整AI产品（如智能助手、内容生成器、专业领域工具）；持续优化提示和系统设计，降低延迟，提高性能；记录实现过程和解决方案，形成技术文档。</span>
                                              </li>
                                            </ul>
                                          </>
                                        );
                                      default:
                                        return (
                                          <>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">要解锁{detailNode?.name}技能，您可以：</p>
                                            <ul className="text-sm space-y-2 pl-2">
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">1</span>
                                                </div>
                                                <span>建立学习计划：为目标技能设定具体学习目标和时间表；拆分为可管理的小步骤，确保每天持续进步；使用学习管理工具（如Notion、Trello）跟踪进度并回顾学习效果。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">2</span>
                                                </div>
                                                <span>多元学习资源：结合官方文档、专业书籍、在线课程和视频教程；使用交互式平台（如Codecademy、Coursera）进行实践；订阅行业简报和专业博客，保持知识更新。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">3</span>
                                                </div>
                                                <span>项目实践：制定个人项目，应用新学知识；参与开源协作或黑客马拉松，获取实战经验；创建作品集，展示技能应用能力和解决问题的方法。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">4</span>
                                                </div>
                                                <span>社区学习：加入专业技术社区（如GitHub、Stack Overflow）；参与线上讨论组和学习圈子；向专家寻求指导和反馈，同时帮助新手解决问题，巩固自己的理解。</span>
                                              </li>
                                              <li className="flex items-start">
                                                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">5</span>
                                                </div>
                                                <span>反思与调整：定期回顾学习进度和掌握程度；使用费曼技巧（向他人解释概念）检验理解；根据反馈和自我评估，调整学习方法和重点，确保高效成长。</span>
                                              </li>
                                            </ul>
                                          </>
                                        );
                                    }
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        )
                      })()}
                      
                      {(() => {
                        const detailNode = getCurrentDetailNode();
                        if (!detailNode) return null;
                        
                        return (
                          <>
                            {/* 技能效果已被移除 */}
                      
                                                          {detailNode.attributes?.requirements && (
                              <div className="skill-requirements w-full">
                          <h4 className="text-slate-800 dark:text-slate-200 font-medium mb-3 text-sm flex items-center">
                            <Target className="w-4 h-4 mr-1.5 text-blue-500" />
                            前置条件
                          </h4>
                          <div className="bg-slate-100/80 dark:bg-slate-700/50 p-4 rounded-lg">
                            <ul className="space-y-2">
                                    {detailNode.attributes?.requirements.map((req: string, index: number) => (
                                <li key={index} className="text-slate-700 dark:text-slate-300 text-sm flex items-start">
                                  <span className="text-blue-500 dark:text-blue-400 mr-2">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                          </>
                        )
                      })()}
                    </div>
                    
                    {/* 技能提升按钮部分 */}
                    {(() => {
                      const detailNode = getCurrentDetailNode();
                      if (!detailNode) return null;
                      
                      if (detailNode.attributes?.level === 0) {
                        return null;
                      }
                      
                      const level = detailNode.attributes?.level || 0;
                      const maxLevel = detailNode.attributes?.maxLevel;
                      return level > 0 && 
                        maxLevel !== undefined &&
                        level < maxLevel && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        提升技能等级
                      </motion.button>
                        )
                    })()}
                  </motion.div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 阅读雷达选项卡内容 */}
          <TabsContent value="reading" className="mt-6 focus-visible:outline-none">
            <div className="space-y-8">
              {/* 阅读概览 */}
              <div className="bg-white/60 dark:bg-slate-800/40 border border-blue-100/30 dark:border-blue-800/20 rounded-xl shadow-lg p-6 backdrop-blur-md">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-5 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 shadow-sm">
                    <BookOpenCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  阅读概览
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 transform group-hover:scale-105 transition-transform duration-500 rounded-xl"></div>
                    <div className="bg-blue-50/80 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100/50 dark:border-blue-800/30 relative z-10 h-full flex flex-col items-center justify-center group-hover:border-blue-200/70 dark:group-hover:border-blue-700/50 transition-colors duration-300">
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">8+</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">年度阅读</p>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 transform group-hover:scale-105 transition-transform duration-500 rounded-xl"></div>
                    <div className="bg-indigo-50/80 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30 relative z-10 h-full flex flex-col items-center justify-center group-hover:border-indigo-200/70 dark:group-hover:border-indigo-700/50 transition-colors duration-300">
                      <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">4</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">核心领域</p>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 transform group-hover:scale-105 transition-transform duration-500 rounded-xl"></div>
                    <div className="bg-purple-50/80 dark:bg-purple-900/30 p-4 rounded-xl border border-purple-100/50 dark:border-purple-800/30 relative z-10 h-full flex flex-col items-center justify-center group-hover:border-purple-200/70 dark:group-hover:border-purple-700/50 transition-colors duration-300">
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">12+</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">精选推荐</p>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 dark:from-rose-500/10 dark:to-orange-500/10 transform group-hover:scale-105 transition-transform duration-500 rounded-xl"></div>
                    <div className="bg-rose-50/80 dark:bg-rose-900/30 p-4 rounded-xl border border-rose-100/50 dark:border-rose-800/30 relative z-10 h-full flex flex-col items-center justify-center group-hover:border-rose-200/70 dark:group-hover:border-rose-700/50 transition-colors duration-300">
                      <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent">30+</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">关键洞察</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 分类Tabs */}
              <Tabs defaultValue={readingRadar[0].category} className="w-full">
                <div className="flex justify-center mb-6 overflow-x-auto pb-2 custom-scrollbar">
                  <TabsList className="bg-blue-50/70 dark:bg-slate-800/50 p-1 rounded-full border border-blue-100/50 dark:border-blue-900/30 shadow-md backdrop-blur-sm">
                    {readingRadar.map(category => (
                      <TabsTrigger 
                        key={category.category} 
                        value={category.category}
                        className="px-4 py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-700 data-[state=inactive]:dark:text-slate-300 transition-all duration-300"
                      >
                        {getCategoryIcon(category.category)} {category.category}
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
                          className="group"
                        >
                          <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 h-full border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm">
                            <CardContent className="p-0 flex flex-col h-full">
                              <div className="flex p-5 pb-3">
                                <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg overflow-hidden flex-shrink-0 mr-4 shadow-md border border-blue-200/50 dark:border-blue-800/30 group-hover:scale-105 transition-transform duration-500 relative">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 z-10"></div>
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
                                  <div className="text-xs px-2.5 py-1 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center whitespace-nowrap">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {book.readDate}
                                  </div>
                                )}
                              </div>
                              
                              <div className="px-5 pb-3 flex-1">
                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                                  "{book.recommendReason}"
                                </p>
                              </div>
                              
                              <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                <p className="text-xs font-medium text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider mb-2 flex items-center">
                                  <Lightbulb className="w-3.5 h-3.5 mr-1" />
                                  关键洞察
                                </p>
                                <ul className="space-y-1.5">
                                  {book.keyInsights.slice(0, 2).map((insight, i) => (
                                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start">
                                      <span className="text-blue-500 mr-1.5 mt-0.5 font-bold">&rsaquo;</span>
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