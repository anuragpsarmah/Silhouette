"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { Lamp } from "@/components/ui/lamp";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FlipWordsConditional } from "@/components/ui/flip-words-conditional";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: any) => {
    setIsToggled(true);
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    async function getCurrentMessageAcceptanceStatus() {
      try {
        const response = await fetch(`/api/acceptMessage`);
        const data = await response.json();

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
        } else {
          setIsChecked(data.isAcceptingMessage);
        }
      } catch (error) {
        console.log("Error fetching message acceptance status: ", error);
        toast("Error fetching message acceptance status.", {
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
    getCurrentMessageAcceptanceStatus();
  }, []);

  useEffect(() => {
    async function updateMessageAcceptanceStatus() {
      try {
        const response = await fetch(`/api/acceptMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageAcceptFlag: isChecked }),
        });

        const data = await response.json();
        console.log(response.status, data.message);

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

    if (isToggled) {
      updateMessageAcceptanceStatus();
    }
  }, [isChecked]);

  const WhiteSwitch = styled(Switch)(({ theme }) => ({
    width: 70,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#FFFFFF",
        transform: "translateX(22px)",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#FFFFFF",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#FFFFFF",
      width: 30,
      height: 30,
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#808080",
      borderRadius: 20 / 2,
    },
  }));

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  return (
    <HeroHighlight>
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
                router.replace(`/dashboard/messages`);
              }}
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div
                style={{ padding: "0.4rem" }}
                className="relative flex space-x-[4px] items-center justify-center z-10 rounded-full bg-zinc-950 py-0.5 ring-1 ring-white/10 "
              >
                <span>View Message</span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
            <button
              className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
              style={{ width: "7rem" }}
              onClick={() => {
                signOut();
              }}
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div
                style={{ padding: "0.4rem", paddingLeft: "0.9rem" }}
                className="relative flex space-x-[4px] items-center justify-center z-10 rounded-full bg-zinc-950 py-0.5 ring-1 ring-white/10 "
              >
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
        }
      </AnimatePresence>
      <Lamp />
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
              duration: 0.75,
              delay: 0.75,
            }}
            className={cn(
              "fixed inset-0 flex items-center justify-center z-20 h-[1000px]"
            )}
          >
            <div className="flex flex-col items-center justify-centerp-4 rounded-lg">
              <WhiteSwitch
                checked={isChecked}
                onChange={handleChange}
                sx={{
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      transform: "translateX(33px)",
                    },
                  },
                }}
              />
              <FlipWordsConditional
                words={["Nah. I am too sensitive!", "Yep. Bring it on!"]}
                condition={isChecked}
                className="mt-2 text-xl text-white"
              />
              <div className="mt-[8rem] gap-2 flex flex-row item-center justify-center align-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={`${window.location.origin}/${username}`}
                  readOnly
                  className="p-2 text-black w-[17rem]"
                  style={{
                    backgroundColor: "rgb(147,147,147)",
                    borderRadius: "4px",
                  }}
                />
                <CopyToClipboard
                  text={`${window.location.origin}/${username}`}
                  onCopy={() =>
                    toast("Copied to clipboard!", {
                      position: "bottom-right",
                      autoClose: 1500,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: false,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                      progressClassName: "custom-progress-bar",
                    })
                  }
                >
                  <button className="shadow-[0_0_0_2px_#000000_inset] px-6 py-2 bg-black border-[1px] border-black dark:border-white dark:text-white text-black rounded-lg font-bold">
                    Copy
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <ToastContainer />
    </HeroHighlight>
  );
}
