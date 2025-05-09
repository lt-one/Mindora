import UnderConstruction from "@/components/ui/UnderConstruction";

export const metadata = {
  title: "关于我们 | 建设中",
  description: "了解我们的背景、价值观和使命",
};

export default function AboutPage() {
  return (
    <UnderConstruction 
      title="关于页面正在建设中" 
      message="我们正在精心打造关于页面，以便向您展示我们的背景故事、价值观和使命。敬请期待！"
      backUrl="/"
      backLabel="返回首页"
    />
  );
} 