"use client";

import { signIn } from "next-auth/react";
import { PageMain } from "../components/pageMain.jsx"

export default function LoginPage() {
  return (
    <PageMain classes={"items-center"}>
      {/* Ambient background blur */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
        
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white">
          Welcome to SkillHub
        </h1>

        <p className="mb-8 text-center text-sm text-white/70">
          Sign up or log in to continue
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/profile" })}
          className="group flex mx-auto justify-center  gap-3 rounded-xl w-1/3 bg-white px-5 py-3 font-medium text-gray-800 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google"
            className="h-5 w-5 transition-transform group-hover:scale-110"
          />
          <span>Continue with Google</span>
        </button>
    </PageMain>
  );
}
