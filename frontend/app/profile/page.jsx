"use client";

import { useAuth } from "../components/AuthProvider.jsx";
import {PageMain} from "../components/pageMain.jsx"
import { ProfileCard } from "../components/ProfileCard";
import { SkillEditor } from "../components/SkillEditor";
import { InterestEditor } from "../components/InterestEditor";

export default function ProfilePage() {
  const { isLoggedIn, accessToken, userData } = useAuth();

  return (
    <PageMain>
      <ProfileCard title="General Info">
        <div className="flex flex-row justify-between items-center">
          <div>
            <p>Name: {userData.first_name} {userData.last_name}</p>
            <p>Email: {userData.email}</p>
          </div>
          <img className="h-15 w-15" src={userData.profile_pic}/>
        </div>
      </ProfileCard>
        
      <ProfileCard title="Teaching Skills">
        <SkillEditor />
      </ProfileCard>

      <ProfileCard title="Learning Interests">
        <InterestEditor />
      </ProfileCard>

    </PageMain>
  );
}
