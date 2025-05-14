import Link from "next/link";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">Mindora</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              数据分析与AI创新，发现数据背后的价值
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/lt-one"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              导航
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  项目
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  博客
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  关于我
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  联系
                </Link>
              </li>
            </ul>
          </div>

          {/* Projects */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              项目
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/projects/huawei-sentiment-analysis"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  舆情分析
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/brain-interface-lighting"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  脑机接口
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/data-visualization"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  数据可视化
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/ai-design-tool"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  AI设计
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <ul className="mt-4 space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">1636678670@qq.com</span>
              </li>
              <li>
                <p className="text-gray-400">
                  广东省广州市，中国
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} 刘涛 | Mindora. 保留所有权利。
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            Built with Next.js, Tailwind CSS, and TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 