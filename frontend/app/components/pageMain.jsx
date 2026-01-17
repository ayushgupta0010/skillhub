"use client";

import { Navbar } from "../components/navbar";

export function PageMain({children}) {
  return (
    <>
    <Navbar></Navbar>
    <div className="relative flex min-h-screen h-screen items-center justify-center bg-linear-to-br from-blue-600 via-teal-600 to-green-600 px-4">
        {children}
    </div>
    </>
  );
}
