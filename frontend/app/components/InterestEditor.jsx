"use client";

import { useState } from "react";

export function InterestEditor() {
  const [interests, setInterests] = useState([
    { },
  ]);

  const addInterest = () => {
    setInterests([...interests, { name: "", desiredLevel: "Basic" }]);
  };

  const updateInterest = (index, key, value) => {
    const updated = [...interests];
    updated[index][key] = value;
    setInterests(updated);
  };

  return (
    <div className="space-y-4">
      {interests.map((interest, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Topic of interest"
            value={interest.name}
            onChange={(e) => updateInterest(i, "name", e.target.value)}
            className="rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-white"
          />

          <select
            value={interest.desiredLevel}
            onChange={(e) =>
              updateInterest(i, "desiredLevel", e.target.value)
            }
            className="rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-white"
          >
            <option>Basic</option>
            <option>Comfortable</option>
            <option>Proficient</option>
            <option>Mastery</option>
          </select>
        </div>
      ))}

      <button
        onClick={addInterest}
        className="mt-2 inline-flex items-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-300 transition"
      >
        + Add Learning Interest
      </button>
    </div>
  );
}
