"use client";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration,
        delay: stagger(0.05),
      }
    );
  }, [scope]);

  return (
    <div className={cn("", className)} ref={scope}>
      <div className="leading-relaxed">
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0"
            style={{
              filter: filter ? "blur(8px)" : "none",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default TextGenerateEffect;
