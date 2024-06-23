"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Grow from "@mui/material/Grow";

export default function Dashboard() {
  const [GrowIn, setGrowIn] = useState<boolean>(true);
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const identifier = param.username;
  const [profileImageURL, setProfileImageURL] = useState<string | undefined>();

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
      console.log(responseJson.profileImageUrl);

      if (responseJson.success)
        setProfileImageURL(responseJson.profileImageUrl);
      else {
        console.log("Error getting profile image url.", responseJson.message);
      }
    }

    fetchProfileImageUrl();
  }, []);

  return (
    <HeroHighlight>
      <div className="fixed top-0 left-0 right-0 flex flex-col items-center z-50">
        {profileImageURL && (
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
                  src={profileImageURL}
                  className="rounded-full w-[17rem] h-[17rem] object-cover"
                  alt="Profile"
                />
              </motion.div>
            </AnimatePresence>
            <Grow in={GrowIn} timeout={1200}>
              <div className="mt-8 text-center">
                <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
                  <span className="lg:text-[1.8rem] sizes">
                    Critique Me, Remain Anonymous.
                  </span>
                </h1>
              </div>
            </Grow>
          </>
        )}
      </div>
      <ToastContainer />
    </HeroHighlight>
  );
}
