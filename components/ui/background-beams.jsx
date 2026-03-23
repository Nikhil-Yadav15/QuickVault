"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const BackgroundBeams = ({ className }) => {
  const svgRef = useRef(null);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const generatePaths = () => {
      const newPaths = [];
      for (let i = 0; i < 20; i++) {
        const startX = Math.random() * 100;
        const startY = -10;
        const cp1X = startX + (Math.random() - 0.5) * 40;
        const cp1Y = 30 + Math.random() * 20;
        const cp2X = startX + (Math.random() - 0.5) * 40;
        const cp2Y = 60 + Math.random() * 20;
        const endX = startX + (Math.random() - 0.5) * 30;
        const endY = 110;
        newPaths.push(
          `M${startX} ${startY} C${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`
        );
      }
      return newPaths;
    };
    setPaths(generatePaths());
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={`url(#beam-gradient-${i})`}
            strokeWidth="0.15"
            strokeOpacity="0.3"
            className="animate-beam"
            style={{
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
        <defs>
          {paths.map((_, i) => (
            <linearGradient
              key={i}
              id={`beam-gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop
                offset="50%"
                stopColor={i % 2 === 0 ? "rgba(16,185,129,0.4)" : "rgba(6,182,212,0.4)"}
              />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
};

export default BackgroundBeams;
