"use client";

import { signIn } from "next-auth/react";
import { PageMain } from "../components/pageMain.jsx"

export default function LoginPage() {
  return (
    <PageMain>
      {/* Ambient background blur */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />

      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white">
          Welcome to SkillHub
        </h1>

        <p className="mb-8 text-center text-sm text-white/70">
          Sign up or log in to continue
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/profile" })}
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 font-medium text-gray-800 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google"
            className="h-5 w-5 transition-transform group-hover:scale-110"
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </PageMain>
  );
}
