"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";  
import axiosClient from "../axiosClient"

export function SkillEditor() {
  const { isLoggedIn, accessToken, userData } = useAuth();

  const [skills, setSkills] = useState([
    {skill_name: "", level: "Beginner"},
  ]);

  const addSkill = () => {
    setSkills([...skills, { skill_name: "", level: "Beginner" }]);
  };

  const updateSkill = (index, key, value) => {
    const updated = [...skills];
    updated[index][key] = value;
    setSkills(updated);
  };

  useEffect(() => {
    if (!accessToken) return;

    async function loadSkills() {
      const res = await GETLearnedSkills(accessToken);
      if (Array.isArray(res)) {
        setSkills(res);
        for(let info of res){
          console.log(info)
        }
      }
    }

    loadSkills();
  }, [accessToken]);

  return (
    <div className="space-y-4">
      {skills.map((skill, i) => (
        <div key={i} className="flex flex-row flex-1 align-middle items-center">
          <input
            type="text"
            placeholder="Skill name"
            value={skill?.skill_name}
            onChange={(e) => updateSkill(i, "skill_name", e.target.value)}
            className="rounded-lg bg-zinc-900 flex-111 mr-5 border border-white/10 px-3 py-2 text-white"
          />

          <select
            value={skill?.level}
            onChange={(e) => updateSkill(i, "level", e.target.value)}
            className="rounded-lg bg-zinc-900 flex-11 border border-white/10 px-3 py-2 text-white"
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
      <button onClick={() => POSTLearnedSkills(skills, accessToken)} className="inline-flex flex-1 items-center rounded-lg bg-teal-500 px-4 py-2 text-sm ml-5 font-semibold text-black hover:bg-amber-400 transition">Submit</button>
      
    </div>
  );
}

async function GETLearnedSkills(accessToken){
  console.log(accessToken)
  return await axiosClient("api/users/skills/teach", null, accessToken, "GET")
}

async function POSTLearnedSkills(data, accessToken){
  data = data.map((data) => ({name: data.skill_name, level: data.level}))
  let res = await axiosClient("api/users/skills/teach", data, accessToken)
  console.log(res)
}