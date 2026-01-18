"use client";

import { useAuth } from "../components/AuthProvider.jsx";
import {PageMain} from "../components/pageMain.jsx"
import { ProfileCard } from "../components/ProfileCard";
import { SkillEditor } from "../components/SkillEditor";
import { InterestEditor } from "../components/InterestEditor";
import { DiscordConnect } from "../components/DiscordConnect";

export default function ProfilePage() {
  const { isLoggedIn, accessToken, userData } = useAuth();

  return (
    <PageMain>
      <ProfileCard title="General Info">
        <p>Name: {userData.first_name} {userData.last_name}</p>
        <p>Email: {userData.email}</p>
      </ProfileCard>
        
      <ProfileCard title="Teaching Skills">
        <SkillEditor />
      </ProfileCard>

      <ProfileCard title="Learning Interests">
        <InterestEditor />
      </ProfileCard>

      <ProfileCard title="Discord Connection">
        <DiscordConnect />
      </ProfileCard>
    </PageMain>
  );
}
