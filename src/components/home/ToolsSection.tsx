"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  BarChart2, 
  Brain, 
  PieChart, 
  Compass,
  Sparkles,
  Zap,
  LightbulbIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 模拟数据 - 未来可从API获取
const toolsData = [
  {
    id: "1",
    title: "舆情分析仪表盘",
    description: "全网品牌提及监测和情感分析工具，支持实时预警和趋势可视化",
    icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
    color: "blue",
    link: "/dashboard",
    status: "5000+",
    statusLabel: "日均数据处理",
  },
  {
    id: "2",
    title: "AI提示词生成器",
    description: "根据需求智能生成提示词模板，提升大模型输出质量和效率",
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    color: "purple",
    link: "/tools/prompt-generator",
    status: "65%",
    statusLabel: "效率提升",
  },
  {
    id: "3",
    title: "数据可视化模板",
    description: "多种数据图表模板，一键生成专业数据报告和可视化展示",
    icon: <PieChart className="w-6 h-6 text-green-500" />,
    color: "green",
    link: "/tools/visualization",
    status: "25+",
    statusLabel: "图表类型",
  },
  {
    id: "4",
    title: "产品体验设计导航",
    description: "整合用户洞察和数据分析，辅助产品设计决策和用户体验优化",
    icon: <Compass className="w-6 h-6 text-red-500" />,
    color: "red",
    link: "/tools/product-design",
    status: "20+",
    statusLabel: "产品迭代案例",
  },
];

// 获取卡片颜色样式
const getCardStyles = (color: string) => {
  const styles: Record<string, {
    background: string;
    border: string;
    shadow: string;
  }> = {
    blue: {
      background: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-100 dark:border-blue-900",
      shadow: "shadow-blue-100/30 dark:shadow-blue-900/20"
    },
    purple: {
      background: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-100 dark:border-purple-900",
      shadow: "shadow-purple-100/30 dark:shadow-purple-900/20"
    },
    green: {
      background: "bg-green-50 dark:bg-green-950/40",
      border: "border-green-100 dark:border-green-900",
      shadow: "shadow-green-100/30 dark:shadow-green-900/20"
    },
    red: {
      background: "bg-red-50 dark:bg-red-950/40",
      border: "border-red-100 dark:border-red-900",
      shadow: "shadow-red-100/30 dark:shadow-red-900/20"
    }
  };
  return styles[color] || styles.blue;
};

// 获取徽章颜色样式
const getBadgeStyles = (color: string) => {
  const styles: Record<string, string> = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    purple: "bg-purple-500 hover:bg-purple-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white"
  };
  return styles[color] || styles.blue;
};

const ToolsSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免水合不匹配
  if (!mounted) {
    return null;
  }

  return (
    <section
      id="tools-section"
      className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      {/* 轻量级背景装饰 */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-200/30 dark:bg-purple-900/20 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <LightbulbIcon className="h-5 w-5 text-blue-500" />
            <h2 className="text-sm font-medium text-blue-600 tracking-wider uppercase dark:text-blue-400">
              功能工具
            </h2>
            <LightbulbIcon className="h-5 w-5 text-blue-500" />
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            数据分析工具
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的数据分析和AI辅助工具，帮助你从数据中发现洞察，优化决策流程
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {toolsData.map((tool) => {
            const cardStyles = getCardStyles(tool.color);
            const badgeStyles = getBadgeStyles(tool.color);
            
            return (
              <Card 
                key={tool.id} 
                className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${cardStyles.background} ${cardStyles.border} ${cardStyles.shadow}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                      {tool.icon}
                    </div>
                    <Badge className={badgeStyles}>
                      {tool.status} {tool.statusLabel}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-xl">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Button variant="ghost" asChild className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700">
                    <Link href={tool.link} className="flex items-center gap-2">
                      开始使用
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                    <Zap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                更多专业工具正在开发中
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                基于实际项目经验构建的数据分析工具集，致力于为您提供高效便捷的专业解决方案
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/tools">
                浏览全部工具
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;