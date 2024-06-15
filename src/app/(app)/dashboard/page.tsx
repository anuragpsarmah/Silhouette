"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { Lamp } from "@/components/ui/lamp";
import Grow from "@mui/material/Grow";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export default function Dashboard() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <HeroHighlight>
      <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{
            opacity: 0,
            y: -70,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className={cn(
            "fixed top-4 right-4 z-50",
          )}
        >
        <button          
          className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
          onClick={() => {signOut()}}
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div style ={{padding: "0.4rem", paddingLeft: "1rem"}} className="relative flex space-x-[4px] items-center z-10 rounded-full bg-zinc-950 py-0.5 ring-1 ring-white/10 ">
            <span>Log Out</span>
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.75 8.75L14.25 12L10.75 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </motion.div>
      )}
    </AnimatePresence>
      <Lamp />
      <ToastContainer />
    </HeroHighlight>
  );
}