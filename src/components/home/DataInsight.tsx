"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, ArrowRight, AreaChart, Info } from "lucide-react";

// 懒加载ECharts以减小首屏加载体积
const LineChartComponent = dynamic(() => import("@/components/charts/LineChartPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <LineChart className="h-12 w-12 text-gray-300 dark:text-gray-600" />
    </div>
  ),
});

const BarChartComponent = dynamic(() => import("@/components/charts/BarChartPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600" />
    </div>
  ),
});

const DataInsight = () => {
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
      id="data-insights"
      className="py-16 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <AreaChart className="h-5 w-5 text-blue-500" />
            <h2 className="text-sm font-medium text-blue-600 tracking-wider uppercase dark:text-blue-400">数据分析</h2>
            <AreaChart className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            数据洞察
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            通过舆情分析和数据可视化，发现数据背后的趋势和价值
          </p>
        </div>

        <Tabs defaultValue="sentiment" className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="sentiment" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                舆情分析
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                市场趋势
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-4">
            <TabsContent value="sentiment" className="focus-visible:outline-none focus-visible:ring-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle>智能手机品牌舆情走势</CardTitle>
                      <CardDescription className="mt-1">
                        过去6个月主要智能手机品牌舆情声量与情感分析
                      </CardDescription>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
                      <Info className="h-3.5 w-3.5 mr-1" />
                      更新于: 2023年12月20日
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-72 w-full">
                    <LineChartComponent />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col text-sm border-t pt-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    华为新品发布后正面舆情显著增长，负面舆情维持在低位。Apple新品发布期间舆情波动较大，三星整体舆情趋于平稳。
                  </p>
                  <div className="flex justify-end w-full">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">
                        查看详细分析
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="market" className="focus-visible:outline-none focus-visible:ring-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle>智能硬件消费者关注点分析</CardTitle>
                      <CardDescription className="mt-1">
                        用户最关注的产品特性及满意度评分
                      </CardDescription>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
                      <Info className="h-3.5 w-3.5 mr-1" />
                      更新于: 2023年12月15日
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-72 w-full">
                    <BarChartComponent />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col text-sm border-t pt-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    AI功能已成为消费者最关注的产品特性，拍照性能和续航能力仍是重要考量因素。华为在AI功能和拍照方面获得最高评分。
                  </p>
                  <div className="flex justify-end w-full">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">
                        查看详细分析
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              查看数据仪表盘
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DataInsight; 