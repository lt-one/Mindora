"use client";

import React from 'react';
import SiteCard, { SiteCardProps } from './SiteCard';
import { AnimatePresence } from 'framer-motion';
import { MotionDiv } from '@/components/motion';

interface SiteGridProps {
  sites: SiteCardProps[];
}

export default function SiteGrid({ sites }: SiteGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (sites.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">没有找到符合条件的网站</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={sites.length} // 用于在站点列表变化时触发动画
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {sites.map((site, index) => (
          <MotionDiv 
            key={site.name + index} 
            variants={item}
            className="h-full"
          >
            <SiteCard {...site} />
          </MotionDiv>
        ))}
      </MotionDiv>
    </AnimatePresence>
  );
} 