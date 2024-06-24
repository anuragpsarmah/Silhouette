"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FloatingNavMain } from "@/components/ui/floating-navbar-main";
import { FloatingNavForm } from "@/components/ui/floating-navbar-form";
import Grow from "@mui/material/Grow";
import { useParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Verify() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [GrowIn, setGrowIn] = useState<boolean>(true);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const param = useParams<{ username: string }>();
  const [identifier, fromPage] = param.username.split("-");
  const router = useRouter();

  useEffect(() => {
    if (fromPage === "fromsignup") {
      toast("User registered successfully. Verify your email.", {
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
    if (fromPage === "fromsignin") {
      toast("Verify your email.", {
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
  }, [fromPage]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const otpCode = otp.join("");

    if (otpCode.length !== 6 || otp.some((digit) => digit === "")) {
      toast("Please enter a valid 6-digit OTP.", {
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
      setIsSubmitting(false);
      return;
    }

    try {      
      const response = await fetch("/api/verifyCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          verificationCode: otpCode,
        }),
      });

      const data = await response.json();

      toast(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        progressClassName: "custom-progress-bar",
      });
      if(data.success){
        setTimeout(() => {
          router.replace("/signin");
        }, 2000);
      }    
    } catch (error) {
      console.error(error);
      toast("An error occurred. Please try again later.", {
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

    setIsSubmitting(false);
  };

  return (
    <HeroHighlight>
      <center>
        {isSmallScreen ? (
          <FloatingNavForm
            navItems={[
              {
                name: "Home",
                link: "/",
              },
              {
                name: "About",
                link: "/",
              },
              {
                name: "Contact",
                link: "https://www.anuragpsarmah.me/#contact",
              },
            ]}
          />
        ) : (
          <FloatingNavMain
            navItems={[
              {
                name: "Home",
                link: "/",
              },
              {
                name: "About",
                link: "/",
              },
              {
                name: "Contact",
                link: "https://www.anuragpsarmah.me/#contact",
              },
            ]}
          />
        )}
      </center>
      <Grow in={GrowIn} timeout={300}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col max-w-md mx-auto mt-[4rem] space-y-4 p-6 bg-black text-white border border-gray-500 rounded-lg shadow-lg lg:w-[34rem] mt-5"
        >
          <h2 className="text-2xl font-bold text-center">Verify OTP</h2>

          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-10 h-10 text-center bg-black text-white placeholder-neutral-400 border border-gray-500 focus:ring-2 focus:ring-blue-500 rounded-md"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className="space-y-1 text-white inline-flex hover:brightness-200 h-10 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-300 focus:ring-offset-1 focus:ring-offset-slate-800"
            disabled={isSubmitting}>
            {isSubmitting ? <FaSpinner className="animate-spin" /> : "Verify"}
          </button>
        </form>
      </Grow>
      <ToastContainer />
    </HeroHighlight>
  );
}
