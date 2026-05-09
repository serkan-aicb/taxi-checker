import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AboCard from "@/components/dashboard/AboCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mein Abo" };

export default async function DashboardAboPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await (supabase
    .from("driver_profiles")
    .select("subscription_status, current_period_end, stripe_customer_id")
    .eq("user_id", user.id)
    .single() as any);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-taxi-blue">Mein Abo</h1>
        <p className="text-gray-500 text-sm mt-1">
          Verwalten Sie Ihr TaxiChecker-Abonnement.
        </p>
      </div>
      <AboCard
        status={profile?.subscription_status ?? "none"}
        periodEnd={profile?.current_period_end ?? null}
        hasCustomer={!!profile?.stripe_customer_id}
      />
    </div>
  );
}
