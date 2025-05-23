"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MotionDiv, MotionSpan, MotionPath, MotionSvg } from "@/components/motion";

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
    md: "text-xl md:text-2xl",
    lg: "text-2xl md:text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {/* Glow effect - enhanced aurora effect */}
        <div
          className={cn(
            "absolute -inset-[3px] rounded-md opacity-80 blur-lg",
            variant === "default" 
              ? "bg-gradient-to-r from-violet-600 via-cyan-400 to-blue-500" 
              : "bg-gradient-to-r from-violet-500 to-blue-500"
          )}
          style={{ width: size + 6, height: size + 6 }}
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
            <MotionPath
              d="M6 5L6 19L9 16L12 19L15 16L18 19V5"
              stroke="url(#mindora-glow)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            
            {/* Main M path - cleaner, more balanced */}
            <MotionPath
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
          <MotionDiv 
            className="absolute inset-0 rounded-md bg-gradient-to-b from-transparent to-violet-950/20 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1 }}
          >
            <MotionDiv 
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/20 to-transparent"
              animate={{ 
                y: [size, -size], 
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.2]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
          </MotionDiv>
        </div>
      </div>

      {showText && (
        <MotionDiv
          className="relative"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MotionSpan
            className={cn(
              "font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500",
              textSizeClasses[textSize]
            )}
          >
            Mindora
          </MotionSpan>
          <MotionDiv 
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-400 to-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </MotionDiv>
      )}
    </div>
  );
};

export default MindoraLogo; 