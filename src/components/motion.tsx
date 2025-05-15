"use client";

import { motion, MotionProps, SVGMotionProps } from "framer-motion";
import { ComponentType, AllHTMLAttributes, SVGAttributes } from "react";

// 定义扩展了MotionProps的接口，明确包含className属性和事件处理程序
interface ExtendedMotionProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  // 其他可能缺失的HTML属性
  key?: React.Key;
  id?: string;
  
  // 事件处理程序
  onClick?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
}

// 为SVG元素定义扩展接口
interface ExtendedSVGMotionProps extends SVGMotionProps<SVGElement> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  // SVG特有的属性
  d?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: "butt" | "round" | "square" | "inherit";
  strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
  fill?: string;
  opacity?: number | string;
  // 其他SVG通用属性
  key?: React.Key;
  id?: string;
  
  // 事件处理程序
  onClick?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
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
export const MotionButton = motion.button as ComponentType<ExtendedMotionProps>; 

// SVG元素
export const MotionPath = motion.path as ComponentType<ExtendedSVGMotionProps>;
export const MotionSvg = motion.svg as ComponentType<ExtendedSVGMotionProps>; 