"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const FlipWordsConditional = ({
  words,
  condition,
  className,
}: {
  words: [string, string];
  condition: boolean;
  className?: string;
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    setCurrentWord(condition ? words[1] : words[0]);
  }, [condition, words]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentWord}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 20,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        className={cn(
          "z-[-1] inline-block absolute text-left text-neutral-900 dark:text-neutral-100 px-2 py-[3.15rem]",
          className
        )}
      >
        {currentWord}
      </motion.div>
    </AnimatePresence>
  );
};