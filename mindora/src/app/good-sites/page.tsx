import UnderConstruction from "@/components/ui/UnderConstruction";

export const metadata = {
  title: "好站分享 | 建设中",
  description: "分享我收藏的优质网站、工具和资源",
};

export default function GoodSitesPage() {
  return (
    <UnderConstruction 
      title="好站分享功能正在建设中" 
      message="我们正在整理和收集各类优质的网站、工具和资源，打造一个实用的导航平台，助您提高工作效率和学习体验。敬请期待！"
      backUrl="/"
      backLabel="返回首页"
    />
  );
} 