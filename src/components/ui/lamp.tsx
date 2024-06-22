"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import "./component.css";

export function Lamp() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          opacity: {
            duration: 1,
            ease: "easeInOut",
            keyframes: [0, 0.5, 1],
          },
          y: {
            duration: 1.2,
            ease: "easeInOut",
          },
          delay: 1,
        }}
        className="flex flex-col mt-8 gap-3 bg-black dark:bg-white py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        <span>Ready to handle</span>
        <span>criticism?</span>
      </motion.h1>
    </LampContainer>
  );
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: any) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div
      className={cn(
        "relative flex min-h-[650px] w-full flex-col items-center justify-center overflow-x-hidden rounded-md z-0",
        className
      )}
      style={{ width: "100vw" }}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.4, width: "15rem" }}
          whileInView={{ opacity: 0.8, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 1.2,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            overflow: "visible !important",
          }}
          className="bowlA absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-white via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-[100rem] h-[100%] left-0  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.4, width: "15rem" }}
          whileInView={{ opacity: 0.8, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 1.2,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="bowlB absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-white to-transparent text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-20 w-full translate-y-12 scale-x-105 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-20 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-20 w-[28rem] -translate-y-1/2 rounded-full bg-white opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 1.2,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-white "
        ></motion.div>

        <div className="relative inset-auto z-40 h-44 w-full -translate-y-[12.5rem] "></div>
      </div>
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5 mb-0">
        {children}
      </div>
    </div>
  );
};
