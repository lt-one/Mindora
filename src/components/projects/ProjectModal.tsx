"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Project } from "@/types/project";
import { Calendar, Clock, User, Building, Check, ArrowUpRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideCloseButton className="w-full max-w-4xl p-0 sm:p-6 overflow-hidden">
        <div className="absolute top-5 right-5 z-10">
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full p-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus-visible:ring-blue-500"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">关闭</span>
            </Button>
          </DialogClose>
        </div>

        <div className="flex flex-col space-y-6">
          {/* 标题和基本信息 */}
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {project.title}
            </DialogTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              {project.summary}
            </p>
          </DialogHeader>

          {/* 图片区域 */}
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={project.images[0] || project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 1024px, 100vw"
              quality={90}
            />
          </div>

          {/* 项目信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
            <div className="space-y-4">
              {/* 项目元数据 */}
              <div className="flex flex-wrap gap-3">
                {project.completionDate && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>完成日期：{project.completionDate}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>项目周期：{project.duration}</span>
                  </div>
                )}
                {project.role && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-lg">
                    <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>担任角色：{project.role}</span>
                  </div>
                )}
                {project.client && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-lg">
                    <Building className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>客户：{project.client}</span>
                  </div>
                )}
              </div>

              {/* 技术标签 */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">使用技术</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* 项目成果 */}
              {project.results && project.results.length > 0 && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">项目成果</h4>
                  <ul className="space-y-1">
                    {project.results.map((result, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 项目挑战 */}
              {project.challenges && project.challenges.length > 0 && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">项目挑战</h4>
                  <ul className="space-y-1">
                    {project.challenges.slice(0, 3).map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 查看完整按钮 */}
          <div className="flex justify-center mt-4 mb-6 px-6">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              onClick={onClose}
            >
              查看项目详情
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 