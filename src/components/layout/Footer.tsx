"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Github, Calendar, ArrowUpRight } from "lucide-react";
import MindoraLogo from "@/components/ui/MindoraLogo";

// 创建微信图标组件，因为lucide-react库中没有微信图标
const WechatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="none"
    {...props}
  >
    <path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z" fill="currentColor" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-200 py-16 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 三列布局 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Logo和简介 - 现在放在左侧列 */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block mb-6">
              <MindoraLogo size={40} textSize="lg" />
            </Link>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              Mindora致力于创造连接数据与人类的体验，结合技术与创意，打造有深度和价值的数字解决方案。
            </p>
            <div className="flex md:justify-start justify-center space-x-4">
              <Link
                href="https://github.com/lt-one"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:1636678670@qq.com"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
              <Link
                href="weixin://contacts/profile/a190191383"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText("a190191383");
                  alert("微信号已复制到剪贴板: a190191383");
                }}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-all duration-300"
                aria-label="WeChat"
                title="点击复制微信号: a190191383"
              >
                <WechatIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* 导航链接 - 中间列分为两个部分 */}
          <div className="grid grid-cols-2 gap-8">
            {/* 探索部分 */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">探索</h3>
              <ul className="space-y-3">
              <li>
                  <Link href="/" className="text-gray-400 hover:text-white text-sm hover:underline transition-colors">
                  首页
                </Link>
              </li>
              <li>
                  <Link href="/projects" className="text-gray-400 hover:text-white text-sm hover:underline transition-colors">
                    项目展示
                </Link>
              </li>
              <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white text-sm hover:underline transition-colors">
                    博客文章
                </Link>
              </li>
              <li>
                  <Link href="/about" className="text-gray-400 hover:text-white text-sm hover:underline transition-colors">
                  关于我
                </Link>
              </li>
            </ul>
          </div>

            {/* 服务部分 */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">服务</h3>
              <ul className="space-y-3">
              <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm hover:underline transition-colors">
                    数据仪表盘
                </Link>
              </li>
              <li>
                  <Link href="/todo" className="text-gray-400 hover:text-white text-sm hover:underline transition-colors">
                    Todo应用
                </Link>
              </li>
              <li>
                  <Link href="/good-sites" className="text-gray-400 hover:text-white text-sm hover:underline transition-colors">
                    好站分享
                </Link>
              </li>
              <li>
                  <Link href="/after-scene" className="text-gray-400 hover:text-white text-sm hover:underline transition-colors">
                    散场之后
                </Link>
              </li>
            </ul>
            </div>
          </div>

          {/* 联系信息 - 右侧列 */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">联系方式</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start text-sm">
                <Mail className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-gray-300">1636678670@qq.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start text-sm">
                <Phone className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-gray-300">19256680512</span>
              </li>
              <li className="flex items-start justify-center md:justify-start text-sm">
                <MapPin className="w-4 h-4 text-blue-400 mr-2 mt-0.5" />
                <span className="text-gray-300">广东省广州市，中国</span>
              </li>
              <li className="flex items-center justify-center md:justify-start text-sm">
                <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-gray-300">周一至周五: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="flex flex-col items-center border-t border-gray-800 pt-10">
          <p className="text-gray-400 text-xs mb-4">
            © {currentYear} <span className="font-medium text-white">刘涛</span> | Mindora
          </p>
          
          <div className="flex space-x-6 text-xs">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 