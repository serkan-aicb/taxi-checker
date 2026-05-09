import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QrCodeCard from "@/components/dashboard/QrCodeCard";
import { Info, Printer, Smartphone, Star, Lock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "QR-Code" };

const STEPS = [
  {
    n: "1",
    title: "QR-Code herunterladen",
    body: "Laden Sie das PNG herunter – es ist bereits druckoptimiert mit weißem Rand.",
  },
  {
    n: "2",
    title: "Ausdrucken & platzieren",
    body: "Bringen Sie den Code gut sichtbar im Fahrzeug an – z.B. auf der Kopfstütze oder dem Armaturenbrett.",
  },
  {
    n: "3",
    title: "Fahrgäste einladen",
    body: "Bitten Sie Fahrgäste am Ende der Fahrt, den Code zu scannen und eine Bewertung zu hinterlassen.",
  },
  {
    n: "4",
    title: "Bewertungen verfolgen",
    body: "Neue Bewertungen erscheinen sofort in Ihrem Dashboard unter Bewertungen.",
  },
];

const TIPS = [
  {
    icon: Printer,
    title: "Drucken",
    body: "Ideal als Aufkleber (5x5 cm) oder auf Visitenkartengröße.",
  },
  {
    icon: Smartphone,
    title: "Digital teilen",
    body: "Kopieren Sie den Link und teilen Sie ihn per WhatsApp oder Telegram.",
  },
  {
    icon: Star,
    title: "Mehr Sterne",
    body: "Fahrer mit QR-Code erhalten im Schnitt 3x mehr Bewertungen.",
  },
];

export default async function DashboardQrCodePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await (supabase
    .from("driver_profiles")
    .select("id, first_name, last_name, slug, subscription_status")
    .eq("user_id", user.id)
    .single() as any);

  if (!profile) redirect("/dashboard/profil");

  const isActive = profile.subscription_status === "active" || profile.subscription_status === "trialing";
  const fullName = profile.first_name + " " + profile.last_name;

  if (!isActive) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-taxi-blue">Ihr QR-Code</h1>
          <p className="text-gray-500 text-sm mt-1">
            Teilen Sie Ihren persönlichen QR-Code mit Fahrgästen, um Bewertungen zu erhalten.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-10 text-center max-w-md">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="font-semibold text-taxi-blue mb-2">QR-Code gesperrt</h2>
          <p className="text-gray-500 text-sm mb-6">
            Der QR-Code wird freigeschaltet, sobald Ihr Abo aktiv ist.
          </p>
          <Link href="/dashboard/abo" className="btn-primary">
            Abo jetzt aktivieren
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-taxi-blue">Ihr QR-Code</h1>
        <p className="text-gray-500 text-sm mt-1">
          Teilen Sie Ihren persönlichen QR-Code mit Fahrgästen, um Bewertungen zu erhalten.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QrCodeCard slug={profile.slug} driverName={fullName} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h2 className="font-semibold text-taxi-blue mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-taxi-yellow" />
              So verwenden Sie Ihren QR-Code
            </h2>
            <ol className="space-y-4 text-sm text-gray-600">
              {STEPS.map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-taxi-yellow text-taxi-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {n}
                  </span>
                  <div>
                    <p className="font-medium text-taxi-blue mb-0.5">{title}</p>
                    <p className="text-gray-500">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TIPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-xl p-5 shadow-card text-center">
                <div className="w-10 h-10 rounded-xl bg-taxi-yellow/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-taxi-yellow" />
                </div>
                <p className="font-semibold text-taxi-blue text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
