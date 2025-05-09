"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MindoraLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
  variant?: "default" | "simple";
}

const MindoraLogo: React.FC<MindoraLogoProps> = ({
  className,
  size = 40,
  showText = true,
  textSize = "md",
  variant = "default",
}) => {
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {/* Glow effect - enhanced aurora effect */}
        <div
          className={cn(
            "absolute -inset-[2px] rounded-md opacity-75 blur-lg",
            variant === "default" 
              ? "bg-gradient-to-r from-violet-600 via-cyan-400 to-blue-500" 
              : "bg-gradient-to-r from-violet-500 to-blue-500"
          )}
          style={{ width: size + 4, height: size + 4 }}
        />

        {/* Logo container */}
        <div
          className="relative flex items-center justify-center rounded-md bg-slate-950/90 shadow-xl border border-slate-800/50"
          style={{ width: size, height: size }}
        >
          {/* Improved M letter with more aurora-like effect */}
          <svg
            width={size * 0.8}
            height={size * 0.8}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Subtle background glow */}
            <motion.path
              d="M6 5L6 19L9 16L12 19L15 16L18 19V5"
              stroke="url(#mindora-glow)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            
            {/* Main M path - cleaner, more balanced */}
            <motion.path
              d="M6 5L6 19L9 16L12 19L15 16L18 19V5"
              stroke="url(#mindora-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient
                id="mindora-gradient"
                x1="6"
                y1="5"
                x2="18"
                y2="19"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#9C5CF6" />
                <stop offset="50%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient
                id="mindora-glow"
                x1="6"
                y1="5"
                x2="18"
                y2="19"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#C4B5FD" />
                <stop offset="50%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Subtle aurora animation in background */}
          <motion.div 
            className="absolute inset-0 rounded-md bg-gradient-to-b from-transparent to-violet-950/20 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent"
              animate={{ 
                y: [size, -size], 
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.2]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </div>
      </div>

      {showText && (
        <motion.span
          className={cn(
            "font-bold tracking-tight text-foreground",
            textSizeClasses[textSize]
          )}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Mindora
        </motion.span>
      )}
    </div>
  );
};

export default MindoraLogo; 