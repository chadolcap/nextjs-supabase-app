import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { Suspense } from "react";
import { Profile } from "@/types/database";
import { ProfileForm } from "@/components/profile-form";

async function UserDetails() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return JSON.stringify({ sub: user.id, email: user.email }, null, 2);
  }

  return JSON.stringify(data.claims, null, 2);
}

interface ProfileDataProps {
  profile: Profile;
  userId: string;
}

function ProfileDisplay({ profile }: { profile: Profile }) {
  return (
    <div className="space-y-4">
      <div>
        <span className="font-semibold">이메일:</span> {profile?.email || "N/A"}
      </div>
      <div>
        <span className="font-semibold">이름:</span> {profile?.full_name || "미설정"}
      </div>
    </div>
  );
}

async function ProfileData() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null; error: any };

  if (profileError) {
    return (
      <div className="text-sm text-red-600">
        프로필을 불러올 수 없습니다: {profileError.message}
      </div>
    );
  }

  if (!profile) {
    return <div className="text-sm text-gray-600">프로필 정보가 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-bold text-lg mb-4">프로필 보기</h3>
        <ProfileDisplay profile={profile} />
      </div>
      <div>
        <ProfileForm profile={profile} userId={user.id} />
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">프로필 정보</h2>
        <Suspense fallback={<div>프로필 로딩 중...</div>}>
          <ProfileData />
        </Suspense>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">User details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          <Suspense>
            <UserDetails />
          </Suspense>
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
