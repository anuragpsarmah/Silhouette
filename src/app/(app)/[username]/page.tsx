"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import Grow from "@mui/material/Grow";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function Dashboard() {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [GrowIn, setGrowIn] = useState<boolean>(true);
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const identifier = param.username;
  const [profileImageData, setProfileImageData] = useState();
  const [inputValue, setInputValue] = useState<string>("");
  const [flag, setFlag] = useState<boolean>(false);
  const [isAcceptingMessage, setIsAcceptingMessage] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProfileImageUrl() {
      const response = await fetch("/api/getProfileImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: identifier }),
      });
      const responseJson = await response.json();

      if (responseJson.success){
        setProfileImageData(responseJson.profileImageData);
      }
      else {
        console.log("Error getting profile image url.", responseJson.message);
        setFlag(true);
      }
    }
    fetchProfileImageUrl();
  }, []);

  useEffect(() => {
    async function getAcceptanceStatus() {
      try {
        const response = await fetch(`/api/acceptMessageAnonymous`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: identifier }),
        });

        const data = await response.json();

        setIsAcceptingMessage(data?.isAcceptingMessage);

        if (response.status != 200) {
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
        console.log("Error updating message acceptance status: ", error);
        toast("Error updating message acceptance status.", {
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
    }

    getAcceptanceStatus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsTyping(value.length > 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputValue("");
    setIsTyping(false);
    console.log("Submitted:", inputValue);
    // You can add your logic for submission here
  };

  const placeholders = [
    "You are too timid. Speak up!",
    "Maybe you should try a different approach.",
    "What about a new hairstyle?",
    "You are too aggressive. Tone it down a bit.",
    "You should be more confident in your abilities.",
    "Hey, you are doing great! Keep it up!",
  ];

  return (
    <HeroHighlight>
      <div className="fixed top-0 left-0 right-0 flex flex-col items-center z-50">
        {profileImageData && (
          <>
            <AnimatePresence mode="wait">
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
                className="mt-[6rem]"
              >
                <img
                  src={profileImageData}
                  className="rounded-full w-[17rem] h-[17rem] object-cover"
                  alt="Profile"
                />
              </motion.div>
            </AnimatePresence>
            <Grow in={GrowIn} timeout={1080}>
              <div className="mt-8 text-center">
                <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
                  <span className="lg:text-[1.8rem] sizes">
                    Critique Me. Remain Anonymous.
                  </span>
                </h1>
              </div>
            </Grow>
            <AnimatePresence mode="wait">
              {
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 70,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0,
                  }}
                  className={cn(
                    "fixed inset-0 flex items-center justify-center z-20 h-[1000px]"
                  )}
                >
                  <div className="mt-16 w-full max-w-xl">
                    <PlaceholdersAndVanishInput
                      placeholders={isTyping ? [""] : placeholders}
                      onChange={handleInputChange}
                      onSubmit={handleSubmit}
                      value={inputValue}
                    />
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </>
        )}
      </div>
      {flag && (
        <div className="text-2xl">
          <h1>404 NOT FOUND</h1>
        </div>
      )}
      <ToastContainer />
    </HeroHighlight>
  );
}
