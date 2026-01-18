"use client";

import { useState } from "react";

export function DiscordConnect() {
  const [discordId, setDiscordId] = useState("");

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Discord User ID"
        value={discordId}
        onChange={(e) => setDiscordId(e.target.value)}
        className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-white"
      />

      <div className="text-sm text-zinc-300 space-y-2">
        <p className="font-medium text-white">How to find your Discord ID:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open Discord and go to User Settings</li>
          <li>Enable <strong>Developer Mode</strong> (Advanced)</li>
          <li>Right-click your username → <strong>Copy User ID</strong></li>
          <li>Paste it here</li>
        </ol>
      </div>

      <button
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition"
      >
        Save Discord ID
      </button>
    </div>
  );
}
