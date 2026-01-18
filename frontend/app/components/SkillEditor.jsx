"use client";

import { useState } from "react";

export function SkillEditor() {
  const [skills, setSkills] = useState([
    { },
  ]);

  const addSkill = () => {
    setSkills([...skills, { name: "", level: "Beginner" }]);
  };

  const updateSkill = (index, key, value) => {
    const updated = [...skills];
    updated[index][key] = value;
    setSkills(updated);
  };

  return (
    <div className="space-y-4">
      {skills.map((skill, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Skill name"
            value={skill.name}
            onChange={(e) => updateSkill(i, "name", e.target.value)}
            className="rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-white"
          />

          <select
            value={skill.level}
            onChange={(e) => updateSkill(i, "level", e.target.value)}
            className="rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-white"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
        </div>
      ))}

      <button
        onClick={addSkill}
        className="mt-2 inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
      >
        + Add Teaching Skill
      </button>
    </div>
  );
}
