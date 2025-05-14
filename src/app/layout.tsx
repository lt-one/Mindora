import type { Metadata, Viewport } from "next";
// import { Inter } from "next/font/google"; // 移除 Google Fonts 导入，使用系统字体代替
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// import { getMindoraIconDataURL } from "@/components/ui/MindoraIconSVG"; // THIS LINE IS REMOVED
import DOMProtection from "@/components/layout/DOMProtection";

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
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any'
      }
    ],
    apple: {
      url: '/apple-icon.png',
      type: 'image/png',
      sizes: '180x180'
    }
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
        {/* <div className="scanlines pointer-events-none"></div> */}
        {/* <div className="waterEffect pointer-events-none"></div> */}
        {/* <div className="noise pointer-events-none"></div> */}
        {/* <div className="vignette pointer-events-none"></div> */}
        {/* <div className="crt-lines pointer-events-none"></div> */}
        <div className="fixed inset-0 bg-neural pointer-events-none z-[-1]"></div>
        
        <Navbar />
        <main className="flex-grow pt-0 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
