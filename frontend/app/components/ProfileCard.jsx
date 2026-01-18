"use client";

import { Star } from "lucide-react";

export function ProfileCard({ title, other, stars, pfp, children }) {
  return (
    <section className="mb-6 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-xl">
      <header className="px-6 py-4 border-b w-full border-white/10 flex flex-row justify-between">
        <div className="flex flex-col justify-between items-center">
          <h2 className="font-semibold text-2xl text-white">{title}</h2>
          <h2 className="font-semibold text-white">{other}</h2>
          <div className="flex flex-row">
            {Array.from({length: stars + 1}).map((_, i) => 
              <Star className="text-yellow-300" key={i}></Star>
            )}
          </div>
        </div>
        {(pfp) ? <img className="h-15 w-15" src={pfp}/> : <></>}
        
      </header>
      <div className="p-6 text-white">  
        {children}
      </div>
    </section>
  );
}
