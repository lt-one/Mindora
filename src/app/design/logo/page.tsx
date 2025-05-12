import MindoraLogoDemo from "@/components/ui/MindoraLogoDemo";
import MindoraIconSVG from "@/components/ui/MindoraIconSVG";

export const metadata = {
  title: "Mindora Logo设计 | Mindora - 心光",
  description: "Mindora Logo的设计展示和变体",
};

export default function LogoDesignPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Mindora Logo设计</h1>
        
        <div className="mb-12 bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-semibold mb-4">设计理念</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Mindora Logo设计灵感来源于两个核心概念：<span className="font-medium">心智</span>和<span className="font-medium">极光</span>。
            通过简约的M字母结构和流动的渐变色彩，体现出"心光"的意境 — 心智的探索和成长，如极光般绚烂而深邃。
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            设计采用现代几何美学，确保在保持简约的同时具有识别度。色彩以深蓝、紫色和青色为主，模拟北极光的自然渐变，象征着思考的深度与创新的活力。
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            该Logo设计适用于各种场景，从网站图标到营销材料，保持一致性的品牌识别，同时在不同背景和尺寸下均有良好表现。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-4">SVG图标展示</h2>
            <div className="flex justify-center items-center p-6 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg">
              <MindoraIconSVG width={120} height={120} />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-4">色彩方案</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-violet-600"></div>
                <span className="text-sm mt-2 text-slate-700 dark:text-slate-300">#9C5CF6</span>
                <span className="text-xs text-slate-500">主色调</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-cyan-400"></div>
                <span className="text-sm mt-2 text-slate-700 dark:text-slate-300">#22D3EE</span>
                <span className="text-xs text-slate-500">辅助色</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-blue-500"></div>
                <span className="text-sm mt-2 text-slate-700 dark:text-slate-300">#3B82F6</span>
                <span className="text-xs text-slate-500">点缀色</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-semibold mb-4">Logo变体展示</h2>
          <MindoraLogoDemo />
        </div>
      </div>
    </div>
  );
} 