"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { LampDemo } from "@/components/ui/lamp";
import Grow from "@mui/material/Grow";
import { useRouter } from "next/navigation";

export default function Dashboard() {

  return (
    <HeroHighlight>
      <LampDemo />
      <ToastContainer />
    </HeroHighlight>
  );
}
