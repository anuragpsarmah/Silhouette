"use client";
import React, { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import Link from "next/link";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FloatingNav } from "@/components/ui/floating-navbar";
import Zoom from "@mui/material/Zoom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/FirebaseExports";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useRouter } from 'next/router';

export default function Page() {
  const [zoomIn, setZoomIn] = useState<boolean>(true);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const [usernameAvailabilityMessage, setUsernameAvailabilityMessage] =
    useState("");

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
  ); // Adjust the debounce delay as needed

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
    const router = useRouter();

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
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      } catch (error) {
        console.error("Error during image upload:", error);
      }
    } else {
      if (!formData.image) console.log("No image to upload");
      else console.log("Username is invalid");
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
        router.push('/verify');
      } else {
        console.error("Error registering user:", data.message);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };

  return (
    <HeroHighlight>
      <center>
        <FloatingNav
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
      </center>
      <Zoom in={zoomIn} timeout={250}>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto mt-[6rem] space-y-4 p-6 bg-black text-white border border-gray-500 rounded-lg shadow-lg lg:w-[34rem] mt-5"
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
                  ? "text-green-500 text-sm"
                  : "text-red-500 text-sm"
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

          <center>
            <button
              type="submit"
              className="text-white inline-flex h-10 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-300 focus:ring-offset-1 focus:ring-offset-slate-800"
            >
              Sign Up
            </button>
          </center>
          <div className="text-center text-sm mt-4">
            <p>
              Already have an account?{" "}
              <Link href="/signin">
                <span style={{ color: "rgb(51 107 198)" }}>Sign in</span>
              </Link>
            </p>
          </div>
        </form>
      </Zoom>
    </HeroHighlight>
  );
}
