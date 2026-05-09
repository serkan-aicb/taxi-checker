import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/dashboard/ProfileEditForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mein Profil" };

export default async function DashboardProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await (supabase
    .from("driver_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single() as any);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-taxi-blue">Mein Profil</h1>
        <p className="text-gray-500 text-sm mt-1">
          Halten Sie Ihre Informationen aktuell – je vollständiger Ihr Profil, desto mehr Vertrauen.
        </p>
      </div>
      <ProfileEditForm profile={profile} />
    </div>
  );
}
