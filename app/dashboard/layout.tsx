import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard | TaxiChecker", template: "%s | Dashboard" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await (supabase
    .from("driver_profiles")
    .select("id, first_name, last_name, slug, profile_image")
    .eq("user_id", user.id)
    .single() as any);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardNav profile={profile} userEmail={user.email ?? ""} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
