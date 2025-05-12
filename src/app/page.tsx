import HeroSection from "@/components/home/HeroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import LatestPosts from "@/components/home/LatestPosts";
import DataInsight from "@/components/home/DataInsight";
import ToolsSection from "@/components/home/ToolsSection";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden">
      {/* 个人品牌展示区 - Hero Section */}
      <HeroSection />
      
      {/* 精选项目展示区 */}
      <FeaturedProjects />
      
      {/* 最新博客文章区 */}
      <LatestPosts />
      
      {/* 数据可视化概览区 */}
      <DataInsight />
      
      {/* 效率工具入口区 */}
      <ToolsSection />
    </main>
  );
}
