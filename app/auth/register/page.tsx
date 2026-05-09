import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Als Fahrer registrieren | TaxiChecker",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-taxi-blue flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 bg-taxi-yellow rounded-lg flex items-center justify-center">
          <Star className="w-4 h-4 text-taxi-blue fill-taxi-blue" />
        </div>
        <span className="text-white font-bold text-xl">
          Taxi<span className="text-taxi-yellow">Checker</span>
        </span>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-taxi-blue">Fahrerprofil erstellen</h1>
            <p className="text-gray-500 text-sm mt-1">
              Registrierung kostenlos – öffentliches Profil ab 9,90 €/Monat
            </p>
          </div>
          <RegisterForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            Bereits registriert?{" "}
            <Link href="/auth/login" className="text-taxi-yellow font-medium hover:underline">
              Jetzt anmelden
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
          Mit der Registrierung stimmen Sie unserer{" "}
          <Link href="/datenschutz" className="underline hover:text-white transition-colors">
            Datenschutzerklärung
          </Link>{" "}
          zu.
        </p>
      </div>
    </div>
  );
}
