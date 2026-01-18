"use client";

export function ProfileCard({ title, children }) {
  return (
    <section className="mb-6 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-xl">
      <header className="px-6 py-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </header>
      <div className="p-6 text-white">
        {children}
      </div>
    </section>
  );
}
