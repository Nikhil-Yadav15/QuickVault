"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const ShinyText = ({
  children,
  className,
  shimmerWidth = 100,
  speed = 3,
}) => {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-[length:250%_100%] animate-shiny-text",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(
          120deg,
          rgba(255, 255, 255, 0.4) 0%,
          rgba(255, 255, 255, 1) 33%,
          rgba(255, 255, 255, 0.4) 66%,
          rgba(16, 185, 129, 0.8) 100%
        )`,
        animationDuration: `${speed}s`,
      }}
    >
      {children}
    </span>
  );
};

export default ShinyText;
