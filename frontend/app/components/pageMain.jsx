"use client";

import { Navbar } from "../components/navbar";

export function PageMain({children}) {
  return (
    <>
    <Navbar></Navbar>
    <div className="pt-18 relative flex min-h-screen h-screen justify-center bg-linear-to-br from-blue-600 via-teal-600 to-green-600 px-4">
        {children}
    </div>
    </>
  );
}
