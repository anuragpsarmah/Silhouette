"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { GlareCard } from "@/components/ui/glare-card";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Grow from "@mui/material/Grow";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  let flag = true;

  interface Message {
    _id: string;
    content: string;
    createdAt: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [GrowIn, setGrowIn] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }
  }, [messages]);

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
    }
  }, [session]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--slide-direction",
      direction === "right" ? "100%" : "-100%"
    );
  }, [direction]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/getMessages");
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        if (data.message !== "No messages found.")
          toast(data.message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            progressClassName: "custom-progress-bar",
          });
      }
      setIsLoaded(true);
    } catch (error) {
      toast("Failed to fetch messages.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        progressClassName: "custom-progress-bar",
      });
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const response = await fetch(`/api/deleteMessage/${messageId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        toast(data.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          progressClassName: "custom-progress-bar",
        });
      } else {
        toast(data.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          progressClassName: "custom-progress-bar",
        });
      }
    } catch (error) {
      toast("Failed to delete.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        progressClassName: "custom-progress-bar",
      });
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setGrowIn(false);
      setTimeout(() => {
        setGrowIn(true);
      }, 100);
    }
  }, [messages]);

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= messages.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(messages.length - 3, 0) : prevIndex - 3
    );
  };

  if (!session || !session.user) {
    return (
      <HeroHighlight>
        <div></div>
      </HeroHighlight>
    );
  }

  const { username } = session.user as User;

  return (
    <div className="overflow-hidden">
      <HeroHighlight>
        {messages.length === 0 ? (
          isLoaded ? (
            <Grow in={GrowIn} timeout={1200}>
              <div>
                <h1 className="text-3xl font-bold mb-8 text-white">
                  Well, you haven&apos;t been criticised yet. That&apos;s a good thing.
                </h1>
                <center>
                  <button
                    className="bg-slate-800 no-underline hover:scale-105 transition ease-in-out delay-100 align-center group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
                    style={{ width: "7rem" }}
                    onClick={() => {
                      router.replace(`/dashboard`);
                    }}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-full">
                      <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </span>
                    <div
                      style={{ padding: "0.4rem" }}
                      className="relative flex space-x-[4px] items-center justify-center z-10 rounded-full bg-zinc-950 py-0.5 ring-1 ring-white/10 "
                    >
                      <span>Dashboard</span>
                    </div>
                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                  </button>
                </center>
              </div>
            </Grow>
          ) : (
            <HeroHighlight>
              <div></div>
            </HeroHighlight>
          )
        ) : (
          <>
          <Grow in={GrowIn} timeout={1200}>
            <div>
              <h1 className="text-3xl font-bold mb-6">
                Well, that&apos;s okay. Only words bleed.
              </h1>
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <TransitionGroup className="contents">
                    {messages
                      .slice(currentIndex, currentIndex + 3)
                      .map((message) => (
                        <CSSTransition
                          key={message._id}
                          timeout={300}
                          classNames="slide"
                        >
                          <div className="transition-all duration-300">
                            <GlareCard className="p-6 h-full">
                              <div className="flex flex-col h-full justify-between">
                                <p className="text-white mb-4">
                                  {message.content}
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-400">
                                    {new Date(
                                      message.createdAt
                                    ).toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => handleDelete(message._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded hover:scale-105"
                                    style={{ zIndex: "100" }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </GlareCard>
                          </div>
                        </CSSTransition>
                      ))}
                  </TransitionGroup>
                </div>
                {messages.length > 3 && (
                  <div>
                    <button
                      onClick={prevSlide}
                      className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full bg-transparent text-white p-2 rounded-full hover:bg-gray-800/30 transition-colors duration-200"
                      aria-label="Previous slide"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full bg-transparent text-white p-2 rounded-full hover:bg-gray-800/30 transition-colors duration-200"
                      aria-label="Next slide"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Grow>
          <AnimatePresence mode="wait">
          {
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
              className={cn("flex flex-row gap-2 fixed top-4 right-4 z-50")}
            >
              <button
                className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
                style={{ width: "7rem" }}
                onClick={() => {
                  router.replace(`/dashboard`);
                }}
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div
                  style={{ padding: "0.4rem" }}
                  className="relative flex space-x-[4px] items-center justify-center z-10 rounded-full bg-zinc-950 py-0.5 ring-1 ring-white/10 "
                >
                  <span>Dashboard</span>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </button>
            </motion.div>
          }
        </AnimatePresence>
        </>
        )}
        <ToastContainer />
      </HeroHighlight>
    </div>
  );
}
