"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SplitText = ({
  text,
  className,
  charClassName,
  delay = 0.05,
  duration = 0.5,
}) => {
  const words = text.split(" ");

  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex mr-[0.25em]">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: duration,
                delay: (wordIndex * word.length + charIndex) * delay,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className={cn("inline-block", charClassName)}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
