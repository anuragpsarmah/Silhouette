"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FloatingNav } from "@/components/ui/floating-navbar";
import Zoom from "@mui/material/Zoom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/FirebaseExports";

export default function Page() {
  const [zoomIn, setZoomIn] = useState<boolean>(true);

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
    
    // Process the form data here
    console.log("Form data:", formData);

    if (formData.image) {
      try {
        const imageRef = ref(storage, `profileImages/${formData.username}`);
        const uploadTask = uploadBytesResumable(imageRef, formData.image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress function (optional)
          },
          (error) => {
            console.error("Error uploading image: ", error);
          },
          async () => {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Image uploaded successfully, URL:", imageUrl);
            // Continue with form submission, including imageUrl in the data
          }
        );
      } catch (error) {
        console.error("Error during image upload:", error);
      }
    } else {
      // Handle form submission without an image
      console.log("No image to upload");
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
