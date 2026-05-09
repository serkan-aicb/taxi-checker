"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Star, QrCode, LogOut, Menu, X, ChevronRight, CreditCard,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/profil", label: "Mein Profil", icon: User, exact: false },
  { href: "/dashboard/bewertungen", label: "Bewertungen", icon: Star, exact: false },
  { href: "/dashboard/qr-code", label: "QR-Code", icon: QrCode, exact: false },
  { href: "/dashboard/abo", label: "Mein Abo", icon: CreditCard, exact: false },
];

interface Props {
  profile: { id: string; first_name: string; last_name: string; slug: string; profile_image: string | null } | null;
  userEmail: string;
}

export default function DashboardNav({ profile, userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = profile
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : "?";

  const NavContent = () => (
    <>
      <div className="p-5 border-b border-taxi-blue-muted">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-taxi-yellow rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-taxi-blue fill-taxi-blue" />
          </div>
          <span className="text-white font-bold text-base">
            Taxi<span className="text-taxi-yellow">Checker</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-taxi-yellow flex items-center justify-center shrink-0">
            <span className="text-taxi-blue font-bold text-sm">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {profile ? `${profile.first_name} ${profile.last_name}` : "Fahrer"}
            </p>
            <p className="text-gray-500 text-xs truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1" aria-label="Dashboard Navigation">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(href, exact)
                    ? "bg-taxi-yellow text-taxi-blue"
                    : "text-gray-400 hover:text-white hover:bg-taxi-blue-muted"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {isActive(href, exact) && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {profile && (
        <div className="p-4 border-t border-taxi-blue-muted">
          <Link
            href={`/fahrer/${profile.slug}`}
            target="_blank"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-taxi-yellow transition-colors px-3 py-2 mb-1"
          >
            <User className="w-3.5 h-3.5" />
            Öffentliches Profil ansehen
          </Link>
        </div>
      )}

      <div className="p-4 pt-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Abmelden
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-taxi-blue border-b border-taxi-blue-muted flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-taxi-yellow rounded-md flex items-center justify-center">
            <Star className="w-3.5 h-3.5 text-taxi-blue fill-taxi-blue" />
          </div>
          <span className="text-white font-bold text-sm">
            Taxi<span className="text-taxi-yellow">Checker</span>
          </span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-white p-2"
          aria-label="Menü öffnen"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-14 bottom-0 w-72 bg-taxi-blue flex flex-col overflow-y-auto">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-taxi-blue border-r border-taxi-blue-muted min-h-screen sticky top-0 h-screen overflow-y-auto">
        <NavContent />
      </aside>

      {/* Mobile spacer */}
      <div className="md:hidden h-14" />
    </>
  );
}
