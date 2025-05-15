"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ComponentType } from "react";

// 使用类型断言确保Motion组件接受className属性
export const MotionDiv = motion.div as ComponentType<HTMLMotionProps<"div">>;
export const MotionP = motion.p as ComponentType<HTMLMotionProps<"p">>;
export const MotionH1 = motion.h1 as ComponentType<HTMLMotionProps<"h1">>;
export const MotionH2 = motion.h2 as ComponentType<HTMLMotionProps<"h2">>;
export const MotionH3 = motion.h3 as ComponentType<HTMLMotionProps<"h3">>;
export const MotionSpan = motion.span as ComponentType<HTMLMotionProps<"span">>;
export const MotionUl = motion.ul as ComponentType<HTMLMotionProps<"ul">>;
export const MotionLi = motion.li as ComponentType<HTMLMotionProps<"li">>;
export const MotionSection = motion.section as ComponentType<HTMLMotionProps<"section">>; 