import HeroSection from "@/components/home/HeroSection";
import ExpertiseSection from "@/components/home/ExpertiseSection";
import SkillJourneySection from "@/components/home/SkillJourneySection";
import FunFactsSection from "@/components/home/FunFactsSection";
import PhilosophySection from "@/components/home/PhilosophySection";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden">
      {/* 个人品牌展示区 - Hero Section */}
      <HeroSection />
      
      {/* 专业技能区 */}
      <ExpertiseSection />
      
      {/* 技能成长与旅程 */}
      <SkillJourneySection />
      
      {/* 趣味事实 */}
      <FunFactsSection />
      
      {/* 个人理念/使命 */}
      <PhilosophySection />
      
    </main>
  );
}
