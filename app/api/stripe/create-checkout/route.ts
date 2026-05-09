import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await (supabase
    .from("driver_profiles")
    .select("id, stripe_customer_id, first_name, last_name")
    .eq("user_id", user.id)
    .single() as any);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Re-use existing Stripe customer or create a new one
  let customerId: string = profile.stripe_customer_id ?? "";
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${profile.first_name} ${profile.last_name}`,
      metadata: { supabase_user_id: user.id, profile_id: profile.id },
    });
    customerId = customer.id;
    await (supabase as any)
      .from("driver_profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", profile.id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxi-checker.de";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/abo?success=1`,
    cancel_url: `${baseUrl}/dashboard/abo?canceled=1`,
    subscription_data: {
      metadata: { profile_id: profile.id },
    },
    locale: "de",
  });

  return NextResponse.json({ url: session.url });
}
