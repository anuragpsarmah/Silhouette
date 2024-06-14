"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import the Link component
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FloatingNav } from "@/components/ui/floating-navbar";
import Zoom from "@mui/material/Zoom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [zoomIn, setZoomIn] = useState<boolean>(true);

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
      <Zoom in={zoomIn} timeout={220}>
        <form className="max-w-md mx-auto mt-[6rem] space-y-4 p-6 bg-black text-white border border-gray-500 rounded-lg shadow-lg lg:w-[34rem] mt-5">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>

          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="bg-black text-white placeholder-neutral-400"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-black text-white placeholder-neutral-400"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-black text-white placeholder-neutral-400"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="image">Profile Image</Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="bg-black text-white"
              style={{ color: "rgb(163 163 163)" }}
            />
          </div>

          <center>
            <button
              type="button"
              className="text-white inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Sign Up
            </button>
          </center>
          <div className="text-center text-sm mt-4">
            <p>
              Already have an account?{" "}
              <Link href="/signin">
                <span style={{color: "rgb(51 107 198)"}}>Sign in</span>
              </Link>
            </p>
          </div>
        </form>
      </Zoom>
    </HeroHighlight>
  );
}
