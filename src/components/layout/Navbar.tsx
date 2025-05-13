"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Search, Sun, Moon, Github, Twitter, Linkedin, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import MindoraLogo from "../ui/MindoraLogo";

const Navbar = () => {
  // 将所有状态的初始值设为null或固定值，以避免服务端/客户端渲染差异
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // 用于确定当前页面路径

  // 将所有客户端逻辑移到useEffect中，确保服务端渲染时不执行这些代码
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // 检查初始主题
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle("dark", initialDarkMode);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // 检查链接是否为当前活跃页面
  const isActive = (path: string): boolean => {
    // 精确匹配主路径
    if (pathname === path) return true;
    
    // 对于子路径，检查是否以父路径开头
    // 例如：/after-scene/books 应该激活 /after-scene 导航项
    if (path !== '/' && pathname.startsWith(path + '/')) return true;
    
    return false;
  };

  // 防止水合不匹配，先返回一个骨架UI直到客户端挂载完成
  if (!mounted) {
    return (
      <header 
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        suppressHydrationWarning
      >
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>
        <div className="w-full px-2 sm:px-3 lg:px-4">
          <div className="flex items-center h-16 mx-0">
            <div className="flex items-center">
              {/* Logo占位符 */}
              <div className="h-10 w-44"></div>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md" 
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      }`}
    >
      {/* 顶部装饰条作为整体导航栏的一部分 */}
      <div className="h-0.5 w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-500 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
      </div>
      
      {/* 移除container类使导航栏扩展到屏幕边缘 */}
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="flex items-center h-16 mx-0">
          {/* 左侧Logo区域 */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center group"
            >
              <MindoraLogo size={46} textSize="md" />
            </Link>
          </div>

          {/* 移除右侧所有内边距 */}
          <div className="flex items-center ml-auto pr-0">
            {/* 桌面端：将导航链接和操作按钮整合为一个统一元素 */}
            <div className="hidden md:flex items-center bg-blue-50/50 dark:bg-blue-900/20 rounded-full border border-blue-100/50 dark:border-blue-800/30 shadow-sm overflow-hidden">
              {/* 导航链接部分 */}
              <nav className="flex items-center px-1">
                {[
                  { href: "/", label: "首页" },
                  { href: "/projects", label: "项目" },
                  { href: "/blog", label: "博客" },
                  { href: "/dashboard", label: "数据仪表盘" },
                  { href: "/good-sites", label: "好站分享" },
                  { href: "/after-scene", label: "散场之后" },
                  { href: "/todo", label: "Todo应用" },
                  { href: "/about", label: "关于" },
                  { href: "/contact", label: "联系" }
                ].map((item, index) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`px-3 py-2 font-medium transition-all duration-300 rounded-full group overflow-hidden ${
                      isActive(item.href) 
                        ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600' 
                        : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-800/30'
                    }`}
                  >
                    <span className="relative z-10 flex items-center">
                      {item.label}
                      {!isActive(item.href) && (
                        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-full transform -translate-x-1/2 group-hover:w-4/5 transition-all duration-300"></span>
                      )}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* 操作按钮部分 - 视觉上是同一个组件的一部分 */}
              <div className="flex items-center border-l border-blue-100/60 dark:border-blue-800/40 pl-1 ml-1">
                <button 
                  className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-800/40 transition-all duration-300"
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 社交媒体图标和装饰元素 - 桌面端 */}
            <div className="hidden md:flex items-center ml-4">
              {/* 装饰性几何元素 */}
              <div className="flex items-center mr-4">
                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full ml-1 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-300 rounded-full ml-1 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              {/* 社交媒体图标 */}
              <div className="flex space-x-2 mr-4">
                <a href="https://github.com/lt-one" target="_blank" rel="noopener noreferrer"
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://space.bilibili.com/51125264" target="_blank" rel="noopener noreferrer"
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  aria-label="Bilibili">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 移动端：操作按钮和菜单按钮 */}
            <div className="flex md:hidden items-center">
              <div className="flex items-center bg-blue-50/50 dark:bg-blue-900/20 rounded-full border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
                <button 
                  className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-800/40 transition-all duration-300"
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-800/40 transition-all duration-300 ml-1"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md border-t border-blue-100/50 dark:border-blue-900/50 transition-all duration-300">
          <nav className="flex flex-col p-4 space-y-1">
            {[
              { href: "/", label: "首页" },
              { href: "/projects", label: "项目" },
              { href: "/blog", label: "博客" },
              { href: "/dashboard", label: "数据仪表盘" },
              { href: "/good-sites", label: "好站分享" },
              { href: "/after-scene", label: "散场之后" },
              { href: "/todo", label: "Todo应用" },
              { href: "/about", label: "关于" },
              { href: "/contact", label: "联系" }
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`px-4 py-3 rounded-md transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white font-medium shadow-sm'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50/60 dark:hover:bg-blue-900/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  {item.label}
                </div>
              </Link>
            ))}
            
            {/* 移动端菜单中的登录按钮和社交媒体图标 */}
            <div className="flex flex-col pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-md hover:shadow-md transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircle className="w-5 h-5" />
                <span>登录 / 注册</span>
              </Link>
              
              <div className="flex justify-center mt-4 space-x-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  aria-label="GitHub">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar; 