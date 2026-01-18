"use client";

import { acceleratedValues, motion } from "framer-motion";
import { ProfileCard } from "../components/ProfileCard";
import { PageMain } from "../components/pageMain";
import axiosClient from "../axiosClient";
import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";

async function getRecommendedUsers(accessToken) {
  let res = await axiosClient(
    "api/users/skills/recommend",
    null,
    accessToken,
    "GET",
  );
  return res
}

async function sendMessagePOST(accessToken, id) {
  let res = await axiosClient(
    "api/contact",
    {other: id},
    accessToken,
  );
  console.log(res)
  return res
}

export default function UserBoard(props) {
  const { isLoggedIn, accessToken, userData } = useAuth();
  const [profiles, setProfiles] = useState([])


  useEffect(() => {
    console.log(accessToken)
    if (!accessToken) return;

    async function showRecommendedprofiles() {
      const res = await getRecommendedUsers(accessToken);
      setProfiles(res)
      console.log(res)
    }

    showRecommendedprofiles();
  }, [accessToken]);

  console.log(profiles)

  return (
    <PageMain>
      <div className="bg-black/50 p-5 rounded-2xl flex flex-col text-center">
        <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-400 to-red-400 drop-shadow-lg mb-2.5">
          Find Somebody and Start Learning!
        </h1>
        <hr className="p-[0.5px] bg-linear-to-r from-cyan-400 via-purple-400 to-red-400"></hr>
      </div>
      <div className="min-h-screen w-full bg-transparent px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 auto-rows-fr">
          {profiles.map((data, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ProfileCard title={`${data.user.first_name} ${data.user.last_name}`} pfp={data.user.profile_pic} stars={data.score}>
                <div className="h-105 flex flex-col justify-between">
                  {/* Skills */}
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-wider text-cyan-400">
                      Skills
                    </div>
                    <div className="flex flex-wrap gap-2 p-5 max-h-[120px] overflow-y-auto">
                      {(data.learns_skills || []).map((skill, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white hover:scale-105 transition whitespace-nowrap border ${skill.level === "Beginner" ? "border-green-400/50 bg-green-400/10" : skill.level === "Intermediate" ? "border-yellow-400/50 bg-yellow-400/10" : skill.level === "Advanced" ? "border-orange-400/50 bg-orange-400/10" : "border-pink-400/50 bg-pink-400/10"}`}
                        >
                          <span className="font-medium">{skill.skill_name}</span>
                          <span className="text-xs text-white/60">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-wider text-purple-400">
                      Interests
                    </div>
                    <div className="flex flex-wrap gap-2 p-5 max-h-[120px] overflow-y-auto">
                      {(data.teaches_skills || []).map((interest, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white hover:scale-105 transition whitespace-nowrap border ${interest.level === "Beginner" ? "border-green-400/50 bg-green-400/10" : interest.level === "Intermediate" ? "border-yellow-400/50 bg-yellow-400/10" : interest.level === "Advanced" ? "border-orange-400/50 bg-orange-400/10" : "border-pink-400/50 bg-pink-400/10"}`}
                        >
                          <span className="font-medium">{interest.skill_name}</span>
                          <span className="text-xs text-white/60">
                            {interest.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Match Button */}
                  <div onClick={() => sendMessagePOST(accessToken, data.user.id)} className="pt-6 flex justify-center  border-t w-full border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-full text-lg font-bold tracking-wide text-black bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 transition-all duration-300"
                    >
                      Message
                    </motion.button>
                  </div>
                </div>
              </ProfileCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageMain>
  );
}
