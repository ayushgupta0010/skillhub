"use client";

import {PageMain} from "../components/pageMain.jsx"
import { ProfileCard } from "../components/ProfileCard";
import { SkillEditor } from "../components/SkillEditor";
import { InterestEditor } from "../components/InterestEditor";
import { DiscordConnect } from "../components/DiscordConnect";

export default function ProfilePage() {
  return (
    <PageMain>
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
