'use client';

import { motion, AnimatePresence } from 'framer-motion';

// 重新导出framer-motion的组件
export { motion, AnimatePresence };

// 为常用的motion组件创建别名，使用更方便
export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionSpan = motion.span;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionP = motion.p;
export const MotionUl = motion.ul;
export const MotionLi = motion.li;
export const MotionButton = motion.button;
export const MotionImg = motion.img;
export const MotionA = motion.a; 