"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Code, Github, Globe, Calendar } from "lucide-react";
import { Project } from "@/types/project";
import ProjectModal from "./ProjectModal";

interface ProjectCardProps {
  project: Project;
  viewMode?: "grid" | "list";
}

export default function ProjectCard({ project, viewMode = "grid" }: ProjectCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isListView = viewMode === "list";
  
  // 处理卡片点击，打开弹窗
  const handleCardClick = (e: React.MouseEvent) => {
    // 防止点击链接或按钮时触发
    if (
      e.target instanceof HTMLElement && 
      (e.target.tagName === 'A' || 
       e.target.tagName === 'BUTTON' || 
       e.target.closest('a') || 
       e.target.closest('button'))
    ) {
      return;
    }
    setIsModalOpen(true);
  };
  
  return (
    <>
      <article
        className={`group relative flex ${isListView ? 'flex-row' : 'flex-col'} overflow-hidden rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleCardClick}
      >
        {/* 闪光效果 */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur transition-all duration-500 group-hover:duration-200 animate-tilt"></div>
        
        {/* 项目缩略图 */}
        <div className={`relative ${isListView ? 'w-1/3 h-40 md:h-52 lg:h-64' : 'w-full aspect-[16/9]'} overflow-hidden`}>
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes={isListView ? "33vw" : "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"}
            quality={85}
          />
          
          {/* 精选项目标记 - 移到这里 */}
          {project.featured && (
            <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden z-10`}>
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-r ${project.highlightColor || 'from-blue-500 to-indigo-500'} rotate-45 transform origin-bottom-left shadow-lg`}>
                <Code className="absolute top-1 right-1 w-3 h-3 text-white animate-pulse" />
              </div>
            </div>
          )}
          
          {/* 日期信息 - 移至右上角带有半透明背景 */}
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg border border-gray-100 dark:border-gray-700 shadow-md">
              <Calendar className="w-3 h-3 text-blue-500 dark:text-blue-400" />
              <span>{project.completionDate}</span>
            </div>
          </div>
          
          {/* 技术标签 - 移至图片底部水平排列，背景渐变增强可读性 */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent z-10">
            <div className="flex flex-wrap gap-1.5 items-center">
              {project.technologies.slice(0, isListView ? 2 : 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-md border border-gray-100/30 dark:border-gray-700/30 shadow-sm"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > (isListView ? 2 : 3) && (
                <span className="px-2 py-1 text-xs font-medium bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-md border border-gray-100/30 dark:border-gray-700/30 shadow-sm">
                  +{project.technologies.length - (isListView ? 2 : 3)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* 项目信息 */}
        <div className={`flex flex-col flex-grow p-5 ${isListView ? 'w-2/3' : 'w-full'}`}>
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {project.title}
            </h3>
          </div>
          
          <p className={`text-sm text-gray-600 dark:text-gray-300 mb-4 ${isListView ? 'line-clamp-3' : 'line-clamp-2'} flex-grow`}>
            {project.summary}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex space-x-1 text-gray-500 dark:text-gray-400">
              {project.sourceCodeUrl && (
                <a 
                  href={project.sourceCodeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform hover:scale-110 duration-300"
                  aria-label="查看源代码"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform hover:scale-110 duration-300"
                  aria-label="查看演示"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
            
            <Link 
              href={`/projects/${project.slug}`}
              className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300"
            >
              查看详情
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </article>
      
      {/* 项目详情弹窗 */}
      <ProjectModal 
        project={project} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 