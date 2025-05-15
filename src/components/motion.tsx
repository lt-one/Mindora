"use client";

import { motion, MotionProps } from "framer-motion";
import { ComponentType } from "react";

// 定义扩展了MotionProps的接口，明确包含className属性
interface ExtendedMotionProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  // 其他可能缺失的HTML属性
  key?: React.Key;
  id?: string;
}

// 使用扩展后的接口作为类型断言
export const MotionDiv = motion.div as ComponentType<ExtendedMotionProps>;
export const MotionP = motion.p as ComponentType<ExtendedMotionProps>;
export const MotionH1 = motion.h1 as ComponentType<ExtendedMotionProps>;
export const MotionH2 = motion.h2 as ComponentType<ExtendedMotionProps>;
export const MotionH3 = motion.h3 as ComponentType<ExtendedMotionProps>;
export const MotionSpan = motion.span as ComponentType<ExtendedMotionProps>;
export const MotionUl = motion.ul as ComponentType<ExtendedMotionProps>;
export const MotionLi = motion.li as ComponentType<ExtendedMotionProps>;
export const MotionSection = motion.section as ComponentType<ExtendedMotionProps>; 