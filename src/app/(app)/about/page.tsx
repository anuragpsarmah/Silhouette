"use client";
import { useState } from "react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FloatingNavMain } from "@/components/ui/floating-navbar-main";
import Grow from "@mui/material/Grow";

export default function About() {
  const [GrowIn, setGrowIn] = useState<boolean>(true);

  return (
    <HeroHighlight>
      <center>
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
        ></FloatingNavMain>
      </center>
      <center>
        <Grow in={GrowIn} timeout={220}>
          <div className="lg:w-[35rem] text-white">
            <h1 className="text-2xl font-bold leading-8 md:font-extrabold lg:text-3xl lg:leading-9">
              <span className="lg:text-4xl sm:text-3xl silhouette">ABOUT SILHOUETTE</span>
            </h1>
            <p className="lg:text-lg text-base leading-6 lg:leading-7 mt-6">
              Welcome to <span className="font-extrabold">Silhouette</span>, your platform for giving and receiving anonymous criticism. Sign up to engage without revealing your identity and manage your experience by choosing to accept or decline anonymous messages.
            </p>
            <p className="lg:text-lg text-base leading-6 lg:leading-7 mt-4">
              Share your unique link to gather criticism directly on your dashboard. Join us in fostering open, honest dialogue through constructive criticism.
            </p>
          </div>
        </Grow>
        <Grow in={GrowIn} timeout={220}>
          <div className="fixed bottom-0 left-0 right-0 mb-4 text-xs text-[#9ca3af] text-center">
            Developed by{" "}
            <a
              href="https://anuragpsarmah.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              Anurag
            </a>
          </div>
        </Grow>
      </center>
    </HeroHighlight>
  );
}
