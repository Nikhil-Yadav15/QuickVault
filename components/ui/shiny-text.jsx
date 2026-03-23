"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const ShinyText = ({
  children,
  className,
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
          #10b981 0%,
          #06b6d4 25%,
          #34d399 50%,
          #06b6d4 75%,
          #10b981 100%
        )`,
        animationDuration: `${speed}s`,
      }}
    >
      {children}
    </span>
  );
};

export default ShinyText;
