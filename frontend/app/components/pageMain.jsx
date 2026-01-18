"use client";

import { Navbar } from "../components/navbar";
import { cn } from "../lib/utils";

export function PageMain({children, classes}) {
  return (
    <>
    <Navbar></Navbar>
    <div className={cn("pt-18 relative flex min-h-screen h-max pb-12 justify-center bg-linear-to-br from-blue-600 via-teal-600 to-green-600 px-4", classes)} >
        <div className="w-full max-w-3/4 rounded-2xl h-fit border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            {children}
        </div>
    </div>
    </>
  );
}
