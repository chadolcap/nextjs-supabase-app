import { Suspense } from "react";

import { redirect } from "next/navigation";

import { InfoIcon } from "lucide-react";

import { ProfileForm } from "@/components/profile-form";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

async function UserDetails() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

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
        <span className="font-semibold">이름:</span>{" "}
        {profile?.full_name || "미설정"}
      </div>
    </div>
  );
}

async function ProfileData() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()) as { data: Profile | null; error: any };

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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h3 className="mb-4 text-lg font-bold">프로필 보기</h3>
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
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="w-full">
        <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <h2 className="mb-4 text-2xl font-bold">프로필 정보</h2>
        <Suspense fallback={<div>프로필 로딩 중...</div>}>
          <ProfileData />
        </Suspense>
      </div>
      <div className="flex flex-col items-start gap-2">
        <h2 className="mb-4 text-2xl font-bold">User details</h2>
        <pre className="max-h-32 overflow-auto rounded border p-3 font-mono text-xs">
          <Suspense>
            <UserDetails />
          </Suspense>
        </pre>
      </div>
      <div>
        <h2 className="mb-4 text-2xl font-bold">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
