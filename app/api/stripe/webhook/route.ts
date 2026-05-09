import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      await syncSubscription(supabase, sub);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await syncSubscription(supabase, sub);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as any;
      const subId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription;
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId as string);
        await syncSubscription(supabase, sub);
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      const subId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription;
      if (subId) {
        await (supabase as any)
          .from("driver_profiles")
          .update({ subscription_status: "past_due" })
          .eq("stripe_subscription_id", subId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function syncSubscription(supabase: any, sub: Stripe.Subscription) {
  const profileId = sub.metadata?.profile_id;
  const status = mapStatus(sub.status);
  const periodEnd = new Date((sub as any).current_period_end * 1000).toISOString();

  if (profileId) {
    await supabase
      .from("driver_profiles")
      .update({
        stripe_subscription_id: sub.id,
        subscription_status: status,
        current_period_end: periodEnd,
      })
      .eq("id", profileId);
  } else {
    // Fallback: look up by customer id
    await supabase
      .from("driver_profiles")
      .update({
        stripe_subscription_id: sub.id,
        subscription_status: status,
        current_period_end: periodEnd,
      })
      .eq("stripe_customer_id", sub.customer as string);
  }
}

function mapStatus(stripeStatus: Stripe.Subscription.Status): string {
  const map: Record<string, string> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "canceled",
    incomplete: "incomplete",
    incomplete_expired: "canceled",
    unpaid: "past_due",
    paused: "canceled",
  };
  return map[stripeStatus] ?? "none";
}
