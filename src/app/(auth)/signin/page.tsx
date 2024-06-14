"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FloatingNavMain } from "@/components/ui/floating-navbar-main";
import { FloatingNavForm } from "@/components/ui/floating-navbar-form";
import Grow from "@mui/material/Grow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";

export default function SignIn() {
  const [GrowIn, setGrowIn] = useState<boolean>(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // States for form inputs
  const [formData, setFormData] = useState<{
    identifier: string;
    password: string;
  }>({
    identifier: "",
    password: "",
  });

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

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const signinParameters = {
      identifier: formData.identifier,
      password: formData.password,
    };

    const validateParameters = signInSchema.safeParse(signinParameters);

    if (!validateParameters.success) {
      const responseErrorMessage: string[] =
        validateParameters.error.errors.map((obj) => obj.message);
      const joinedresponseErrorMessage = responseErrorMessage.join("; ");

      console.log(
        "Following parameters are invalid: ",
        joinedresponseErrorMessage
      );
      toast("Signin parameters are invalid.", {
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
    } else {
      console.log("Parameters are valid");
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        ...signinParameters,
      });

      if (result?.error) {
        toast(result?.error, {
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

      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      toast("Error signing in. Please try later.", {
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
          className="flex flex-col max-w-md mx-auto mt-[6rem] space-y-4 p-6 bg-black text-white border border-gray-500 rounded-lg shadow-lg lg:w-[34rem] mt-5"
        >
          <h2 className="text-2xl font-bold text-center">Sign In</h2>

          <div className="space-y-1">
            <Label htmlFor="username">Username/Email</Label>
            <Input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your username or email"
              className="bg-black text-white placeholder-neutral-400"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="bg-black text-white placeholder-neutral-400"
              required
            />
          </div>
          <button
            type="submit"
            className="space-y-1 text-white inline-flex hover:brightness-200 h-10 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-300 focus:ring-offset-1 focus:ring-offset-slate-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? <FaSpinner className="animate-spin" /> : "Sign In"}
          </button>
          <div className="text-center text-sm mt-4">
            <p>
              Don't have an account?{" "}
              <Link href="/signup">
                <span style={{ color: "rgb(51 107 198)" }}>Sign up</span>
              </Link>
            </p>
          </div>
        </form>
      </Grow>
      <ToastContainer />
    </HeroHighlight>
  );
}
