"use client";

import * as React from "react";
import MindoraLogo from "./MindoraLogo";

const MindoraLogoDemo = () => {
  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-background rounded-lg border border-border">
      <h2 className="text-2xl font-bold text-foreground">Mindora Logo</h2>
      
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center gap-2">
          <MindoraLogo size={60} />
          <span className="text-sm text-muted-foreground">默认Logo</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <MindoraLogo size={80} textSize="lg" />
          <span className="text-sm text-muted-foreground">大号Logo</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <MindoraLogo size={40} showText={false} />
          <span className="text-sm text-muted-foreground">仅图标</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <MindoraLogo size={60} variant="simple" />
          <span className="text-sm text-muted-foreground">简约风格</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <MindoraLogo size={60} />
          </div>
          <span className="text-sm text-muted-foreground">不同背景下的显示效果</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <MindoraLogo size={30} showText={false} />
            <span className="text-xs text-muted-foreground">小尺寸</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <MindoraLogo size={40} showText={false} />
            <span className="text-xs text-muted-foreground">中尺寸</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <MindoraLogo size={50} showText={false} />
            <span className="text-xs text-muted-foreground">大尺寸</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindoraLogoDemo; 