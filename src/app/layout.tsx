import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getMindoraIconDataURL } from "@/components/ui/MindoraIconSVG";
import DOMProtection from "@/components/layout/DOMProtection";

// 移除 Google Fonts 导入，使用系统字体代替
// import { Inter } from "next/font/google";
// 
// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

export const metadata: Metadata = {
  title: "Mindora - 心光",
  description: "Mindora是一个关注个人成长、数据分析和AI技术学习的个人网站",
  keywords: ["个人网站", "数据分析", "AI技术", "个人成长", "学习笔记", "前端开发"],
  icons: {
    icon: [
      { url: getMindoraIconDataURL() },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: getMindoraIconDataURL() },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`min-h-screen flex flex-col antialiased bg-dots`}
      >
        <DOMProtection />
        <div className="floating-shapes">
          <div className="floating-shape w-64 h-64 top-[-2%] left-[15%] opacity-30" style={{ animationDuration: '15s' }}></div>
          <div className="floating-shape w-96 h-96 top-[20%] right-[-5%] opacity-20" style={{ animationDuration: '25s' }}></div>
          <div className="floating-shape w-80 h-80 bottom-[10%] left-[5%] opacity-25" style={{ animationDuration: '20s' }}></div>
          <div className="floating-shape w-48 h-48 bottom-[30%] right-[25%] opacity-15" style={{ animationDuration: '18s' }}></div>
        </div>
        
        <div className="fixed inset-0 bg-neural pointer-events-none z-[-1]"></div>
        
        <Navbar />
        <main className="flex-grow pt-0 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
