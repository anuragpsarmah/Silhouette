"use client";
import { useState } from "react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { FlipWords } from "@/components/ui/flip-words";
import { FloatingNavMain } from "@/components/ui/floating-navbar-main";
import Zoom from "@mui/material/Zoom";

export default function Home() {
  const wordsArray = ["Anonymous.", "Invisible.", "Shadowed.", "Veiled."];
  const [zoomIn, setZoomIn] = useState<boolean>(true);

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
              name: "Contact",
              link: "https://www.anuragpsarmah.me/#contact",
            },
          ]}
        ></FloatingNavMain>
      </center>
      <center>
        <Zoom in={zoomIn} timeout={220}>
          <div className="lg:w-[40rem]">
            <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
              <span className="lg:text-[4rem] sm:text-[3rem] silhouette">SILHOUETTE.</span>
              <br />
              <span className="lg:text-[1.8rem] sizes">
                Critique Freely, Remain<FlipWords words={wordsArray} duration={3000}></FlipWords>
              </span>
            </h1>
          </div>
        </Zoom>
        <Zoom in={zoomIn} timeout={220}>
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
        </div></Zoom>
      </center>
    </HeroHighlight>
  );
}