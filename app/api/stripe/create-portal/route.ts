import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await (supabase
    .from("driver_profiles")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single() as any);

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe customer found" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxi-checker.de";

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${baseUrl}/dashboard/abo`,
  });

  return NextResponse.json({ url: session.url });
}
