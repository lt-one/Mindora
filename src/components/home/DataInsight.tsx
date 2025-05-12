"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// 懒加载ECharts以减小首屏加载体积
const LineChart = dynamic(() => import("@/components/charts/LineChartPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
  ),
});

const BarChart = dynamic(() => import("@/components/charts/BarChartPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
  ),
});

const DataInsight = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("sentiment");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("data-insights");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section
      id="data-insights"
      className="py-16 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            数据洞察
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            通过舆情分析和数据可视化，发现数据背后的趋势和价值
          </p>
        </div>

        {/* 切换选项卡 */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-md bg-gray-200 dark:bg-gray-700">
            <button
              onClick={() => setActiveTab("sentiment")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "sentiment"
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              舆情分析
            </button>
            <button
              onClick={() => setActiveTab("market")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "market"
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              市场趋势
            </button>
          </div>
        </div>

        <div className={`transform transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          {activeTab === "sentiment" ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    智能手机品牌舆情走势
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    过去6个月主要智能手机品牌舆情声量与情感分析
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                  更新于: 2023年12月20日
                </div>
              </div>
              <div className="h-64 md:h-80 w-full">
                <LineChart />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
                华为新品发布后正面舆情显著增长，负面舆情维持在低位。Apple新品发布期间舆情波动较大，三星整体舆情趋于平稳。
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    智能硬件消费者关注点分析
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    用户最关注的产品特性及满意度评分
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                  更新于: 2023年12月15日
                </div>
              </div>
              <div className="h-64 md:h-80 w-full">
                <BarChart />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
                AI功能已成为消费者最关注的产品特性，拍照性能和续航能力仍是重要考量因素。华为在AI功能和拍照方面获得最高评分。
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            查看数据仪表盘 (建设中)
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DataInsight; 