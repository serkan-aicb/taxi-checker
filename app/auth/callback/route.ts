import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
  }

  const user = data.user;

  // Create driver profile if it doesn't exist yet
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing } = await service
    .from("driver_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    const firstName = user.user_metadata?.first_name ?? "";
    const lastName = user.user_metadata?.last_name ?? "";
    const slug = `${firstName}-${lastName}-${Math.random().toString(36).slice(2, 6)}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");

    await service.from("driver_profiles").insert({
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      slug,
    });
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
