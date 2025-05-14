"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  Code, 
  GraduationCap, 
  Heart, 
  Mail, 
  MessageSquare, 
  Monitor, 
  PenTool, 
  User, 
  Wrench, 
  BookOpen,
  Github as GithubIcon,
  Layers,
  ArrowRight,
  LayoutGrid
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function AboutPage() {
  // 定义页面内容数据
  const personalInfo = {
    name: "刘涛",
    title: "产品助理/数据分析师",
    email: "1636678670@qq.com",
    phone: "19256680512",
    location: "广东省广州市",
    avatar: "/images/avatars/avatar.png",
    summary: "具备扎实的数据分析与编程基础，熟悉Python、SQL及主流数据工具，能够独立完成数据采集、清洗、分析与可视化。日均处理产品数据5000+条，具备AI辅助开发和自动化脚本能力，善于用技术提升工作效率。拥有良好的产品思维和团队协作精神，学习能力强，能快速适应新环境并推动项目高效落地。",
  };

  const skills = [
    { name: "Python", level: 88, category: "programming" },
    { name: "SQL", level: 85, category: "programming" },
    { name: "数据分析", level: 90, category: "analytics" },
    { name: "AI辅助开发", level: 92, category: "ai" },
    { name: "Excel高级应用", level: 88, category: "tool" },
    { name: "Tableau", level: 82, category: "tool" },
    { name: "Prompt工程", level: 85, category: "ai" },
    { name: "产品原型设计", level: 75, category: "design" },
    { name: "数据可视化", level: 86, category: "visualization" },
    { name: "自动化脚本", level: 80, category: "programming" },
    { name: "Axure/Xmind/Visio", level: 75, category: "tool" },
    { name: "舆情分析", level: 88, category: "analytics" },
  ];

  const experiences = [
    {
      title: "数据分析师",
      company: "广东数源智汇科技有限公司 | 华为终端监测分析组",
      period: "2024年7月 - 2025年3月",
      description: "负责全网华为品牌相关舆情监测与分析，对品牌产品及相关信息的全网声量进行统计分析，输出产品简报与舆情分析报告。",
      achievements: [
        "搭建全网监测体系，日均处理品牌负面数据5000+，实现重大舆情95%预警响应",
        "设计大模型提示词工程，构建「数据清洗-观点提取-情感分析」prompt，使非技术岗同事分析效率提升65%",
        "设计Tableau数据BI看板，优化PPT表格数据导入流程，为报告输出提效25%",
        "建立标准化舆情汇总SOP，将舆情事件汇总统计时间从1小时压缩至30分钟内",
        "负责输出舆情事件汇总3000+份，协助及主导输出产品日报/周报/月报100+份，推动客户完成20+项产品迭代"
      ]
    },
  ];

  const education = [
    {
      school: "广东技术师范大学",
      degree: "智能科学与技术 学士",
      period: "2020年9月 - 2024年6月",
      description: "主修计算机网络、C语言程序设计、数据结构、操作系统、自然语言处理、数字图像处理、机器学习、深度学习、大数据、数据挖掘等课程。积极参与校园活动，担任科技站宣传部干事，负责新媒体运营与活动策划。"
    }
  ];

  const projects = [
    {
      name: "华为终端产品舆情监测及分析",
      role: "数据分析师",
      period: "2024年7月 - 2025年3月",
      description: "深度参与华为终端产品的全网舆情监测与分析项目。主要负责搭建和维护舆情监测体系，实现对海量信息的实时抓取与处理。通过运用AI大模型和Prompt工程技术，设计并优化了数据智能去噪流程，显著提升了舆情分析的精准度和效率。此外，还负责设计和制作Tableau数据BI看板，优化了数据导入和报告输出流程。",
      achievements: [
        "舆情监测预警：搭建全网监测体系，日均处理品牌负面数据 5000+，实现重大舆情 95%预警响应。",
        "数据智能分析：设计各类汇总事件专用 prompt 提示词，利用 AI 大模型实现数据智能去噪。",
        "深度分析报告：负责输出舆情事件汇总 3000+份，协助及主导输出产品日报/周报/月报 100+份，推动客户完成 20+项产品迭代。",
        "技术提效：设计大模型提示词工程，构建「数据清洗-观点提取-情感分析」prompt，使非技术岗同事分析效率提升 65%。设计 Tableau 数据 BI 看板，优化 PPT 表格数据导入流程，为报告输出提效 25%。编写 Python 脚本，解决部分数据量较大汇总事件的数据处理，优化数据统计及分析流程。",
        "流程优化：建立标准化舆情汇总 SOP，将舆情事件汇总统计时间从 1 小时压缩至 30 分钟内。提出分级预警机制，区分普通舆情与重大舆情，优化舆情监测、预警流程。"
      ],
      technologies: ["Python脚本", "AI大模型", "Prompt工程", "Tableau", "舆情分析", "数据可视化", "SOP优化"]
    },
    {
      name: "基于AI辅助的个人品牌网站开发",
      role: "项目负责人",
      period: "2025年4月 - 2025年5月",
      description: "作为项目负责人，独立完成了个人品牌网站的构思、设计与开发全过程。在设计与规划阶段，创新性地利用Claude AI生成多套网站布局方案，并结合东方哲学与数据分析主题进行筛选与融合。视觉设计上，借助AI设计助手生成具有中国文化元素的太极图标等，并将其融入网站的整体视觉语言。同时，利用AI分析工具对不同页面结构的用户体验进行评估，以优化网站架构。在代码实现阶段，基于Cursor AI编程助手高效构建了React+TypeScript项目基础框架，并利用AI代码生成工具辅助编写复杂组件，如可视化时间线和项目展示卡片。还运用AI工具自动优化Tailwind CSS样式代码，有效解决了动画冲突等技术难题。",
      achievements: [
        "成功构建集成个人简介、项目展示、技能展示和东方哲学等内容的完整个人品牌网站。",
        "通过AI辅助开发，将开发周期缩短40%，同时保持了高水平的代码质量和性能。",
        "利用AI分析工具识别并成功修复了多个开发过程中的技术难点，包括动画冲突和构建部署问题。",
        "在开发过程中积累并总结了多套AI辅助开发的工作流程，显著提升了编程效率和问题解决能力。"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "AI辅助开发", "Claude AI", "Cursor AI", "Prompt Engineering", "UI/UX设计"]
    }
  ];

  return (
    <div className="w-full relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-blue-500/5 rounded-full blur-3xl"></div>
      
      {/* 页面网格装饰 */}
      <div className="absolute inset-0 bg-grid-primary/5 bg-[size:20px_20px] pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 mt-4 relative">
        {/* 页面标题和描述 */}
        <div className="text-center mb-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center space-x-4 mb-3"
          >
            <div className="relative mt-6 w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 dark:from-blue-500 dark:to-purple-600 rounded-full animate-pulse opacity-40"></div>
              <User className="w-7 h-7 text-white dark:text-white z-10" />
            </div>
            <h1 className="text-3xl md:text-5xl mt-6 font-bold tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-blue-400">
              关于我
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-1 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            结合<span className="font-semibold text-blue-500">产品思维</span>与<span className="font-semibold text-purple-500">数据分析</span>，
            用技术创造价值
          </motion.p>
          
          <Separator className="mx-auto w-2/3 md:w-1/3 my-4 bg-gradient-to-r from-blue-400/30 via-purple-500 to-blue-400/30" />
        </div>

        {/* 个人资料卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1"
          >
            <Card className="overflow-hidden border-muted/30 bg-background/80 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-b from-blue-500/10 to-transparent pt-8 pb-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-background/90 shadow-lg mb-3 overflow-hidden">
                    <Image
                      src={personalInfo.avatar}
                      alt={personalInfo.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold">{personalInfo.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span>{personalInfo.title}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-sm">电子邮箱</h4>
                      <p className="text-sm text-muted-foreground">{personalInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-sm">联系电话</h4>
                      <p className="text-sm text-muted-foreground">{personalInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Monitor className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-sm">所在地</h4>
                      <p className="text-sm text-muted-foreground">{personalInfo.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 pb-6 pt-4">
                <Button 
                  variant="default" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  onClick={() => window.open('/刘涛-数据分析师-1年工作经验.pdf', '_blank')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  查看完整简历
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 md:col-span-2"
          >
            <Card className="h-full border-muted/30 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  个人简介
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{personalInfo.summary}</p>
                
                <div className="mt-6">
                  <h3 className="text-base font-medium mb-3 flex items-center">
                    <Code className="h-4 w-4 mr-2 text-blue-500" />
                    专业技能
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {skills.slice(0, 6).map((skill, index) => (
                      <motion.div 
                        key={index} 
                        className="flex flex-col" 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            className={`h-full rounded-full ${
                              skill.category === 'analytics' ? 'bg-gradient-to-r from-blue-500 to-blue-300' :
                              skill.category === 'programming' ? 'bg-gradient-to-r from-purple-600 to-purple-400' :
                              skill.category === 'ai' ? 'bg-gradient-to-r from-green-500 to-blue-400' :
                              skill.category === 'design' ? 'bg-gradient-to-r from-pink-500 to-purple-400' :
                              skill.category === 'visualization' ? 'bg-gradient-to-r from-orange-400 to-yellow-300' :
                              'bg-gradient-to-r from-gray-500 to-gray-400'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className={`${
                          skill.category === 'analytics' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          skill.category === 'programming' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          skill.category === 'ai' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          skill.category === 'design' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' :
                          skill.category === 'visualization' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        } border border-transparent hover:border-current/10 hover:shadow-sm transition-all`}
                      >
                        {skill.name}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 选项卡内容 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="experience" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8 mx-auto">
              <TabsTrigger value="experience" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>工作经历</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>教育背景</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center">
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span>项目经验</span>
              </TabsTrigger>
            </TabsList>
            
            {/* 工作经历内容 */}
            <TabsContent value="experience" className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-muted/30 bg-background/80 backdrop-blur-sm overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className={`h-1.5 ${
                      index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 
                      'bg-gradient-to-r from-indigo-500 to-blue-400'
                    }`}></div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center">
                            <Briefcase className={`h-5 w-5 mr-2 ${index === 0 ? 'text-blue-500' : 'text-indigo-500'}`} />
                            {exp.title}
                          </CardTitle>
                          <CardDescription className="mt-1 flex flex-wrap items-center">
                            <span className="mr-2">{exp.company}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={`${
                          index === 0 ? 'bg-blue-500/10 text-blue-500 border-blue-200 dark:border-blue-800' : 
                          'bg-indigo-500/10 text-indigo-500 border-indigo-200 dark:border-indigo-800'
                        }`}>
                          {exp.period}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>
                      <h4 className="font-medium text-sm mb-3 flex items-center">
                        <Badge variant="outline" className={`${
                          index === 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200' : 
                          'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200'
                        } mr-2 py-1`}>
                          主要成就
                        </Badge>
                      </h4>
                      <ul className="space-y-3">
                        {exp.achievements.map((achievement, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                          >
                            <ArrowRight className={`h-4 w-4 mr-2 mt-0.5 ${
                              index === 0 ? 'text-blue-500' : 'text-indigo-500'
                            } flex-shrink-0 group-hover:translate-x-1 transition-transform`} />
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
            
            {/* 教育背景内容 */}
            <TabsContent value="education" className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-muted/30 bg-background/80 backdrop-blur-sm overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center">
                            <GraduationCap className="h-5 w-5 mr-2 text-purple-500" />
                            {edu.school}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <BookOpen className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {edu.degree}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-200 dark:border-purple-800">
                          {edu.period}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
                      <div className="mt-4">
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                          计算机网络
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                          数据结构
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                          机器学习
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                          深度学习
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                          数据挖掘
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
            
            {/* 项目经验内容 */}
            <TabsContent value="projects" className="space-y-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-muted/30 bg-background/80 backdrop-blur-sm overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className={`h-1.5 ${
                      index === 0 ? 'bg-gradient-to-r from-green-500 to-blue-500' : 
                      index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      'bg-gradient-to-r from-orange-500 to-yellow-500'
                    }`}></div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center">
                            {index === 0 ? (
                              <Monitor className="h-5 w-5 mr-2 text-blue-500" />
                            ) : index === 1 ? (
                              <Code className="h-5 w-5 mr-2 text-purple-500" />
                            ) : (
                              <MessageSquare className="h-5 w-5 mr-2 text-orange-500" />
                            )}
                            {project.name}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {project.role}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={`${
                          index === 0 ? 'bg-blue-500/10 text-blue-500 border-blue-200 dark:border-blue-800' : 
                          index === 1 ? 'bg-purple-500/10 text-purple-500 border-purple-200 dark:border-purple-800' :
                          'bg-orange-500/10 text-orange-500 border-orange-200 dark:border-orange-800'
                        }`}>
                          {project.period}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary" 
                            className={`${
                              index === 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                              index === 1 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                              'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                            } hover:shadow-sm transition-all`}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
} 