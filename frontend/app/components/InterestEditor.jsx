"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider"; 
import axiosClient from "../axiosClient"

export function InterestEditor() {
  const { isLoggedIn, accessToken, userData } = useAuth();

  const [interests, setInterests] = useState([
    {skill_name: "", level: "Beginner"},
  ]);  

  const addInterest = () => {
    setInterests([...interests, { skill_name: "", level: "Beginner" }]);
  };

  const updateInterest = (index, key, value) => {
    const updated = [...interests];
    updated[index][key] = value;
    setInterests(updated);
  };

  useEffect(() => {
    if (!accessToken) return;

    async function loadSkills() {
      const res = await GETInterestedSkills(accessToken);
      if (Array.isArray(res)) { 
        setInterests(res);
        for(let info of res){
          console.log(info)
        }
      }
    }
  
    loadSkills();
  }, [accessToken]);
  

  return (
    <div className="space-y-4">
      {interests.map((interest, i) => (
        <div key={i} className="flex flex-row flex-1 align-middle items-center">
          <input
            type="text"
            placeholder="Topic of interest"
            value={interest?.skill_name}
            onChange={(e) => updateInterest(i, "skill_name", e.target.value)}
            className="rounded-lg bg-zinc-900 flex-111 mr-5 border border-white/10 px-3 py-2 text-white"
          />

          <select
            value={interest?.level}
            onChange={(e) =>
              updateInterest(i, "level", e.target.value)
            }
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
        onClick={addInterest}
        className="mt-2 inline-flex items-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-300 transition"
      >
        + Add Learning Interest
      </button>
      <button onClick={() => POSTInterestedSkills(interests, accessToken)} className="inline-flex flex-1 items-center rounded-lg bg-teal-500 px-4 py-2 text-sm ml-5 font-semibold text-black hover:bg-amber-400 transition">Submit</button>
      
    </div>
  );
}

async function GETInterestedSkills(accessToken){
  let res = await axiosClient("api/users/skills/learn", null, accessToken, "GET")
  return res
}

async function POSTInterestedSkills(data, accessToken){
  data = data.map((data) => ({name: data.skill_name, level: data.level}))
  let res = await axiosClient("api/users/skills/learn", data, accessToken)
}