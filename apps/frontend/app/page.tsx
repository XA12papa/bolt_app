"use client";
import AppBar from "@/components/AppBar";
import HomePage from "@/components/HomePage";
import Sidesbar from "@/components/Sidesbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";// we use useAuth in client component as client component are rendered statically

import React from "react";
export default function Home() {
  
  return (
    <div className="Home_page h-screen w-screen flex flex-col items-center justify-center relative">
        <Sidesbar/>
        <AppBar/>
        <HomePage/>      
    </div>
  );
}
