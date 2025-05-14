import { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我 | Mindora",
  description: "了解我的专业背景、技能和工作经历，结合产品思维与数据分析能力，擅长舆情监测与分析，AI辅助开发。",
  keywords: "产品助理, 数据分析师, 舆情分析, AI辅助开发, Python, SQL, Prompt工程, 刘涛, 个人简介",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 