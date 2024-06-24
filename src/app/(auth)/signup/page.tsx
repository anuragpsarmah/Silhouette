"use client";
import React, { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import Link from "next/link";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FloatingNavMain } from "@/components/ui/floating-navbar-main";
import { FloatingNavForm } from "@/components/ui/floating-navbar-form";
import Grow from "@mui/material/Grow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/FirebaseExports";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import { set } from "lodash";

export default function SignUp() {
  const [GrowIn, setGrowIn] = useState<boolean>(true);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const [usernameAvailabilityMessage, setUsernameAvailabilityMessage] =
    useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // States for form inputs
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    image: File | null;
  }>({
    username: "",
    email: "",
    password: "",
    image: null,
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

  const checkUsernameAvailability = async (username: string) => {
    try {
      const response = await fetch(
        `/api/uniqueUsernameCheck?username=${username}`
      );
      const data = await response.json();
      setUsernameAvailabilityMessage(data.message);
      setIsUsernameValid(data.success);
    } catch (error) {
      console.error("Error checking username availability:", error);
    }
  };

  const debouncedCheckUsernameAvailability = debounce(
    checkUsernameAvailability,
    500
  );

  useEffect(() => {
    if (formData.username) {
      debouncedCheckUsernameAvailability(formData.username);
    } else {
      setUsernameAvailabilityMessage("");
    }
  }, [formData.username]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let profileImageURL = "";
    if (formData.image && isUsernameValid) {
      try {
        const imageRef = ref(storage, `profileImages/${formData.username}`);
        const uploadTask = uploadBytesResumable(imageRef, formData.image);

        profileImageURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progress function (optional)
            },
            (error) => {
              console.error("Error uploading image: ", error);
              toast("Error uploading image.", {
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
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      } catch (error) {
        console.error("Error uploading image.", error);
        toast("Error uploading image.", {
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
    } else {
      if (!formData.image) console.log("No image to upload");
      else {
        console.log("Username is invalid");
        toast("Username is invalid", {
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
      return;
    }

    if (!profileImageURL){
      setIsSubmitting(false);
      return;
    }

    const signupParameters = {
      username: formData.username,
      email: formData.email,
      profileImageUrl: profileImageURL,
      password: formData.password,
    };

    const validateParameters = signUpSchema.safeParse(signupParameters);

    if (!validateParameters.success) {
      const responseErrorMessage: string[] =
        validateParameters.error.errors.map((obj) => obj.message);
      const joinedresponseErrorMessage = responseErrorMessage.join("; ");

      console.log(
        "Following parameters are invalid: ",
        joinedresponseErrorMessage
      );
      toast(joinedresponseErrorMessage, {
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
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupParameters),
      });

      const data = await response.json();
      if (data.success) {
        console.log("User registered successfully:", data.message);
        router.replace(`/verify/${formData.username}-fromsignup`);
      } else {
        console.error("Error during sign-up.", data.message);
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
      console.error("Error during sign-up:", error);
      toast("Error registering user.", {
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
                link: "/about",
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
                link: "/about",
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
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>

          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="bg-black text-white placeholder-neutral-400"
              required
            />
            <p
              className={
                usernameAvailabilityMessage.includes("unique")
                  ? "text-green-300 text-sm"
                  : "text-red-300 text-sm"
              }
              style={
                usernameAvailabilityMessage
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              {usernameAvailabilityMessage}
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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

          <div className="space-y-1">
            <Label htmlFor="image">Profile Image</Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="bg-black text-white"
              style={{ color: "rgb(163 163 163)" }}
              required
            />
          </div>

          <button
            type="submit"
            className="space-y-1 text-white inline-flex hover:brightness-200 h-10 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-300 focus:ring-offset-1 focus:ring-offset-slate-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
          <div className="text-center text-sm mt-4">
            <p>
              Already have an account?{" "}
              <Link href="/signin">
                <span style={{ color: "rgb(51 107 198)" }}>Sign in</span>
              </Link>
            </p>
          </div>
        </form>
      </Grow>
      <ToastContainer />
    </HeroHighlight>
  );
}
